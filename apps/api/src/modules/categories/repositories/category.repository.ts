import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: string, data: CreateCategoryDto, isDefault = false) {
    return this.prisma.category.create({
      data: {
        name: data.name,
        is_default: isDefault,
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async findByProjectId(projectId: string) {
    return this.prisma.category.findMany({
      where: {
        project_id: projectId,
      },
      orderBy: [{ is_default: 'desc' }, { created_at: 'asc' }],
    });
  }

  async update(id: string, data: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async findByIdAndProject(categoryId: string, projectId: string) {
    return this.prisma.category.findFirst({
      where: {
        id: categoryId,
        project_id: projectId,
      },
    });
  }
}
