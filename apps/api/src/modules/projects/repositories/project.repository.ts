import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from '../dto';

@Injectable()
export class ProjectRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(workspaceId: string, data: CreateProjectDto) {
    const defaultCategories = this.configService.get<string[]>(
      'categories.defaults',
    );

    return this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
        categories: {
          create: defaultCategories.map((name) => ({
            name,
            is_default: true,
          })),
        },
      },
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

  async update(id: string, data: UpdateProjectDto) {
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
