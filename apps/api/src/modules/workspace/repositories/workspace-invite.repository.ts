import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '../../../../generated/client/client';

@Injectable()
export class WorkspaceInviteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.WorkspaceInviteCreateInput) {
    return this.prisma.workspaceInvite.create({
      data,
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        invited_by: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.workspaceInvite.findUnique({
      where: { id },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        invited_by: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        token: true,
      },
    });
  }

  async findByWorkspace(workspaceId: string, status?: string) {
    const where: Prisma.WorkspaceInviteWhereInput = {
      workspace_id: workspaceId,
      ...(status && { status }),
    };

    return this.prisma.workspaceInvite.findMany({
      where,
      include: {
        invited_by: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findByEmailAndWorkspace(email: string, workspaceId: string) {
    return this.prisma.workspaceInvite.findUnique({
      where: {
        workspace_id_email: {
          workspace_id: workspaceId,
          email,
        },
      },
    });
  }

  async update(id: string, data: Prisma.WorkspaceInviteUpdateInput) {
    return this.prisma.workspaceInvite.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.workspaceInvite.delete({
      where: { id },
    });
  }
}
