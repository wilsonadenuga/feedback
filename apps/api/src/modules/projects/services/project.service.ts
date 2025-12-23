import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ProjectRepository } from '../repositories/project.repository';
import { CreateProjectDto, UpdateProjectDto } from '../dto';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(workspaceId: string, data: CreateProjectDto) {
    return this.projectRepository.create(workspaceId, data);
  }

  async validateUserAccess(projectId: string, userId: string) {
    const result = await this.projectRepository.validateUserAccess(
      projectId,
      userId,
    );

    if (!result) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return result;
  }

  async findOne(projectId: string) {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(projectId: string, data: UpdateProjectDto) {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.projectRepository.update(projectId, data);
  }

  async delete(projectId: string): Promise<void> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepository.delete(projectId);
  }
}
