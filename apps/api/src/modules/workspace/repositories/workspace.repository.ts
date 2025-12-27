import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '../../../../generated/client/browser';

@Injectable()
export class WorkspaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.WorkspaceCreateInput) {
    return this.prisma.workspace.create({
      data,
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

  async update(id: string, data: Prisma.WorkspaceUpdateInput) {
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
}
