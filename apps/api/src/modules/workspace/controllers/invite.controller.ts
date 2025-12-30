import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WorkspaceInviteService } from '../services/workspace-invite.service';
import {
  CreateWorkspaceInviteDto,
  GetWorkspaceInvitesQueryDto,
  AcceptWorkspaceInviteDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetCurrentUser } from '../../../common/decorators/get-current-user.decorator';
import { ResponseHelper } from '../../../common/helpers';

@ApiTags('invites')
@Controller('invites')
export class InviteController {
  constructor(
    private readonly workspaceInviteService: WorkspaceInviteService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(
    @GetCurrentUser('id') userId: string,
    @Body() dto: CreateWorkspaceInviteDto,
  ) {
    const invite = await this.workspaceInviteService.create(
      dto.workspace_id,
      userId,
      dto,
    );
    return ResponseHelper.success(invite, 'Invitation sent successfully');
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: GetWorkspaceInvitesQueryDto) {
    const invites = await this.workspaceInviteService.findByWorkspace(
      query.workspace_id,
      query.status,
    );
    return ResponseHelper.success(
      invites,
      'Invitations retrieved successfully',
    );
  }

  @Post(':invite_id/accept')
  async accept(
    @Param('invite_id') inviteId: string,
    @Body() dto: AcceptWorkspaceInviteDto,
  ) {
    const result = await this.workspaceInviteService.accept(
      inviteId,
      dto.token,
      dto.display_name,
    );
    return ResponseHelper.success(result, 'Invitation accepted successfully');
  }

  @Delete(':workspace_id/:invite_id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async revoke(
    @Param('workspace_id') workspaceId: string,
    @Param('invite_id') inviteId: string,
  ) {
    await this.workspaceInviteService.revoke(workspaceId, inviteId);
    return ResponseHelper.success(null, 'Invitation revoked successfully');
  }
}
