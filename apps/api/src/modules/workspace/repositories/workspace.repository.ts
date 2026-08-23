import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '../../../../generated/client/client';
import { WORKSPACE_ROLES } from '@feedback/schema';
import { CreateWorkspaceDto } from '../dto';
import { generateSlug } from '../../../common/helpers';

@Injectable()
export class WorkspaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateWorkspaceDto,
    ownerId: string,
    defaultLabels: string[],
  ) {
    return this.prisma.workspace.create({
      data: {
        name: data.name,
        handle: data.handle,
        logo_url: data.logo_url,
        owner: {
          connect: { id: ownerId },
        },
        members: {
          create: {
            user_id: ownerId,
            role: WORKSPACE_ROLES.OWNER,
          },
        },
        settings: {
          create: {},
        },
        labels: {
          create: defaultLabels.map((name) => ({
            name,
            slug: generateSlug(name),
            is_default: true,
          })),
        },
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.workspace.findUnique({
      where: { id },
      include: {
        settings: true,
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
        _count: {
          select: { members: true },
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
      include: {
        _count: {
          select: { members: true },
        },
      },
    });
  }

  async update(id: string, data: Prisma.WorkspaceUpdateInput) {
    return this.prisma.workspace.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { members: true },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.workspace.delete({
      where: { id },
    });
  }
}
