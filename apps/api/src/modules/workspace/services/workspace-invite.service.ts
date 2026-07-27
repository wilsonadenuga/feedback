import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TOKEN_TYPES, WorkspaceRole } from '@feedback/schema';
import { WorkspaceInviteRepository } from '../repositories/workspace-invite.repository';
import { WorkspaceMemberRepository } from '../repositories/workspace-member.repository';
import { TokenService } from '../../token/token.service';
import { UserService } from '../../user/services/user.service';
import { CreateWorkspaceInviteDto } from '../dto';
import { WorkspaceInviteCreatedEvent } from '../events/workspace-invite-created.event';

@Injectable()
export class WorkspaceInviteService {
  constructor(
    private readonly workspaceInviteRepository: WorkspaceInviteRepository,
    private readonly workspaceMemberRepository: WorkspaceMemberRepository,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    workspaceId: string,
    invitedByUserId: string,
    dto: CreateWorkspaceInviteDto,
  ) {
    const existingMember =
      await this.workspaceMemberRepository.findByEmailAndWorkspace(
        dto.email,
        workspaceId,
      );

    if (existingMember) {
      throw new ConflictException('User is already a member of this workspace');
    }

    const existingInvite =
      await this.workspaceInviteRepository.findByEmailAndWorkspace(
        dto.email,
        workspaceId,
      );

    if (existingInvite && existingInvite.status === 'PENDING') {
      throw new ConflictException(
        'An invitation has already been sent to this email',
      );
    }

    const { id: tokenId, value: tokenValue } =
      await this.tokenService.createWorkspaceInviteToken();

    const invite = await this.workspaceInviteRepository.create({
      workspace: {
        connect: { id: workspaceId },
      },
      email: dto.email,
      role: dto.role,
      invited_by: {
        connect: { id: invitedByUserId },
      },
      token: {
        connect: { id: tokenId },
      },
      status: 'PENDING',
    });

    this.eventEmitter.emit(
      'workspace.invite.created',
      new WorkspaceInviteCreatedEvent(
        invite.email,
        invite.workspace.name,
        invite.invited_by.name,
        tokenValue,
        invite.id,
      ),
    );

    return invite;
  }

  async findByWorkspace(workspaceId: string, status?: string) {
    return this.workspaceInviteRepository.findByWorkspace(workspaceId, status);
  }

  async accept(inviteId: string, tokenValue: string, displayName: string) {
    const invite = await this.workspaceInviteRepository.findById(inviteId);

    if (!invite) {
      throw new NotFoundException('Invitation not found');
    }

    if (invite.status !== 'PENDING') {
      throw new BadRequestException(
        'This invitation has already been used or revoked',
      );
    }

    const isTokenValid = await this.tokenService.validateToken(
      tokenValue,
      TOKEN_TYPES.WORKSPACE_INVITE,
    );
    if (!isTokenValid) {
      throw new BadRequestException('Invalid or expired invitation token');
    }

    if (invite.token.value !== tokenValue) {
      throw new BadRequestException('Invalid invitation token');
    }

    let user = await this.userService.findUserByEmail(invite.email);

    if (!user) {
      user = await this.userService.createUser(displayName, invite.email);
      await this.userService.updateUserStatus(user.id, 'ACTIVE');
    } else {
      const existingMember =
        await this.workspaceMemberRepository.checkUserBelongsToWorkspace(
          user.id,
          invite.workspace_id,
        );

      if (existingMember) {
        throw new ConflictException(
          'You are already a member of this workspace',
        );
      }
    }

    await this.workspaceMemberRepository.create({
      workspace: {
        connect: { id: invite.workspace_id },
      },
      user: {
        connect: { id: user.id },
      },
      role: invite.role as WorkspaceRole,
      display_name: displayName,
    });

    await this.workspaceInviteRepository.update(inviteId, {
      status: 'ACCEPTED',
    });

    await this.tokenService.markTokenAsUsed(invite.token_id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      workspace: {
        id: invite.workspace.id,
        name: invite.workspace.name,
      },
    };
  }

  async revoke(workspaceId: string, inviteId: string) {
    const invite = await this.workspaceInviteRepository.findById(inviteId);

    if (!invite) {
      throw new NotFoundException('Invitation not found');
    }

    if (invite.workspace_id !== workspaceId) {
      throw new ForbiddenException(
        'Invitation does not belong to this workspace',
      );
    }

    if (invite.status !== 'PENDING') {
      throw new BadRequestException('Can only revoke pending invitations');
    }

    await this.workspaceInviteRepository.update(inviteId, {
      status: 'REVOKED',
    });

    await this.tokenService.deleteToken(invite.token_id);
    return null;
  }
}
