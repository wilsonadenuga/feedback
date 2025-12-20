import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '../dto';

@Injectable()
export class WorkspaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, data: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
      data: {
        name: data.name,
        logo_url: data.logo_url,
        owner_user_id: ownerId,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.workspace.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            user_id: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        OR: [
          { owner_user_id: userId },
          { members: { some: { user_id: userId } } },
        ],
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
}
