import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '../../../../generated/client/client';

@Injectable()
export class WorkspaceMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.WorkspaceMemberCreateInput) {
    return this.prisma.workspaceMember.create({
      data,
    });
  }

  async checkUserBelongsToWorkspace(userId: string, workspaceId: string) {
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

  async findByEmailAndWorkspace(email: string, workspaceId: string) {
    return this.prisma.workspaceMember.findFirst({
      where: {
        workspace_id: workspaceId,
        user: {
          email,
        },
      },
    });
  }
}
