import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { WorkspaceRepository } from '../repositories/workspace.repository';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const workspaceId = request.params.workspace_id;

    if (!workspaceId) {
      throw new NotFoundException('Workspace ID is required');
    }

    const member = await this.workspaceRepository.findMemberByUserAndWorkspace(
      user.id,
      workspaceId,
    );

    if (!member) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    request.workspaceMember = member;

    return true;
  }
}
