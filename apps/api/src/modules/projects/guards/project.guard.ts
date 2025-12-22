import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRepository } from '../repositories/project.repository';
import { WorkspaceRepository } from '../../workspace/repositories/workspace.repository';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectId = request.params.project_id;

    if (!projectId) {
      throw new NotFoundException('Project ID is required');
    }

    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const member = await this.workspaceRepository.findMemberByUserAndWorkspace(
      user.id,
      project.workspace_id,
    );

    if (!member) {
      throw new ForbiddenException('You do not have access to this project');
    }

    request.project = project;
    request.workspaceMember = member;

    return true;
  }
}
