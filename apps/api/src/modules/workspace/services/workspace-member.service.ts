import { Injectable } from '@nestjs/common';
import { WorkspaceMemberRepository } from '../repositories/workspace-member.repository';
import { AddWorkspaceMemberDto } from '../dto';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    private readonly workspaceMemberRepository: WorkspaceMemberRepository,
  ) {}

  async create(workspaceId: string, data: AddWorkspaceMemberDto) {
    return this.workspaceMemberRepository.create(workspaceId, data);
  }

  async checkUserBelongsToWorkspace(userId: string, workspaceId: string) {
    return this.workspaceMemberRepository.findByUserAndWorkspace(
      userId,
      workspaceId,
    );
  }
}
