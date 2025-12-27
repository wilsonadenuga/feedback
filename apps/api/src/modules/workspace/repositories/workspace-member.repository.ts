import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddWorkspaceMemberDto } from '../dto';

@Injectable()
export class WorkspaceMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(workspaceId: string, data: AddWorkspaceMemberDto) {
    return this.prisma.workspaceMember.create({
      data: {
        workspace_id: workspaceId,
        user_id: data.user_id,
        role: data.role,
        display_name: data.display_name,
      },
    });
  }

  async findByUserAndWorkspace(userId: string, workspaceId: string) {
    return this.prisma.workspaceMember.findFirst({
      where: {
        user_id: userId,
        workspace_id: workspaceId,
      },
      select: {
        id: true,
        role: true,
        workspace_id: true,
        user_id: true,
      },
    });
  }
}
