import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { WorkspaceMemberService } from './workspace-member.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '../dto';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) {}

  async create(userId: string, data: CreateWorkspaceDto) {
    const workspace = await this.workspaceRepository.create(userId, data);
    await this.workspaceMemberService.create(workspace.id, {
      user_id: userId,
      role: 'owner',
    });

    return workspace;
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
}
