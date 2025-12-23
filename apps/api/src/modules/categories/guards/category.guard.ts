import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { ProjectRepository } from '../../projects/repositories/project.repository';
import { WorkspaceRepository } from '../../workspace/repositories/workspace.repository';

@Injectable()
export class CategoryGuard implements CanActivate {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const categoryId = request.params.category_id;

    if (!categoryId) {
      throw new NotFoundException('Category ID is required');
    }

    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const project = await this.projectRepository.findById(category.project_id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const member = await this.workspaceRepository.findMemberByUserAndWorkspace(
      user.id,
      project.workspace_id,
    );

    if (!member) {
      throw new ForbiddenException('You do not have access to this category');
    }

    request.category = category;
    request.project = project;
    request.workspaceMember = member;

    return true;
  }
}
