import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '../../../../generated/client/browser';

@Injectable()
export class LabelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.LabelCreateInput) {
    return this.prisma.label.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.label.findUnique({
      where: { id },
    });
  }

  async findByProjectId(projectId: string) {
    return this.prisma.label.findMany({
      where: {
        project_id: projectId,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: string, data: Prisma.LabelUpdateInput) {
    return this.prisma.label.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.label.delete({
      where: { id },
    });
  }

  async findByIdAndProject(labelId: string, projectId: string) {
    return this.prisma.label.findFirst({
      where: {
        id: labelId,
        project_id: projectId,
      },
    });
  }
}
