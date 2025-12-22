import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from '../dto';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(workspaceId: string, data: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        workspace: {
          connect: {
            id: workspaceId,
          },
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
}
