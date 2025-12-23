import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(private readonly projectService: ProjectService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectId = request.params.project_id;

    if (!projectId) {
      throw new NotFoundException('Project ID is required');
    }

    const { project, member } = await this.projectService.validateUserAccess(
      projectId,
      user.id,
    );

    request.project = project;
    request.workspaceMember = member;

    return true;
  }
}
