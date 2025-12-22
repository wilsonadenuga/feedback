import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '../dto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async create(userId: string, data: CreateWorkspaceDto) {
    return this.workspaceRepository.create(userId, data);
  }

  async findAll(userId: string) {
    return this.workspaceRepository.findByUserId(userId);
  }

  async findOne(workspaceId: string) {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }

  async update(workspaceId: string, data: UpdateWorkspaceDto) {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return this.workspaceRepository.update(workspaceId, data);
  }

  async delete(workspaceId: string): Promise<void> {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    await this.workspaceRepository.delete(workspaceId);
  }

  async getProjects(workspaceId: string) {
    const workspace =
      await this.workspaceRepository.findByIdWithProjects(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace.projects;
  }
}
