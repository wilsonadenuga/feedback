import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '../dto';
import { WORKSPACE_ROLES } from '@feedback/schema';
import { generateSlug } from '../../../common/helpers';

@Injectable()
export class WorkspaceRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(ownerId: string, data: CreateWorkspaceDto) {
    const defaultCategories = this.configService.get<string[]>(
      'categories.defaults',
    );

    return this.prisma.workspace.create({
      data: {
        name: data.name,
        logo_url: data.logo_url,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        members: {
          create: {
            user_id: ownerId,
            role: WORKSPACE_ROLES.ADMIN,
          },
        },
        projects: {
          create: {
            name: 'Default Project',
            description: 'Your first project',
            categories: {
              create: defaultCategories.map((name) => ({
                name,
                slug: generateSlug(name),
                is_default: true,
              })),
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.workspace.findUnique({
      where: { id },
      include: {
        projects: true,
        members: {
          select: {
            id: true,
            role: true,
            display_name: true,
            created_at: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: { some: { user_id: userId } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: string, data: UpdateWorkspaceDto) {
    return this.prisma.workspace.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.workspace.delete({
      where: { id },
    });
  }

  async findMemberByUserAndWorkspace(userId: string, workspaceId: string) {
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

  async findByIdWithProjects(id: string) {
    return this.prisma.workspace.findUnique({
      where: { id },
      include: {
        projects: true,
      },
    });
  }
}
