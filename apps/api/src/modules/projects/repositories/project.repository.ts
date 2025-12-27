import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '../../../../generated/client/browser';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProjectCreateInput) {
    return this.prisma.project.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async findByWorkspaceId(workspaceId: string) {
    return this.prisma.project.findMany({
      where: {
        workspace_id: workspaceId,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }

  async findByIdAndWorkspace(projectId: string, workspaceId: string) {
    return this.prisma.project.findFirst({
      where: {
        id: projectId,
        workspace_id: workspaceId,
      },
    });
  }

  async validateUserAccess(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        workspace: {
          include: {
            members: {
              where: {
                user_id: userId,
              },
              select: {
                id: true,
                role: true,
                workspace_id: true,
                user_id: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return null;
    }

    const member = project.workspace.members[0];
    if (!member) {
      return null;
    }

    return { project, member };
  }
}
