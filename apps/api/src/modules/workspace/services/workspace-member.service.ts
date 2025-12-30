import { Injectable } from '@nestjs/common';
import { WorkspaceMemberRepository } from '../repositories/workspace-member.repository';
import { AddWorkspaceMemberDto } from '../dto';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    private readonly workspaceMemberRepository: WorkspaceMemberRepository,
  ) {}

  async create(workspaceId: string, data: AddWorkspaceMemberDto) {
    return this.workspaceMemberRepository.create({
      workspace: {
        connect: { id: workspaceId },
      },
      user: {
        connect: { id: data.user_id },
      },
      role: data.role,
      display_name: data.display_name,
    });
  }

  async checkUserBelongsToWorkspace(userId: string, workspaceId: string) {
    return this.workspaceMemberRepository.checkUserBelongsToWorkspace(
      userId,
      workspaceId,
    );
  }
}
