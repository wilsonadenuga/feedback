import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { generateSlug } from '../../../common/helpers';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(projectId: string, data: CreateCategoryDto) {
    return this.categoryRepository.create({
      name: data.name,
      slug: generateSlug(data.name),
      is_default: false,
      project: {
        connect: {
          id: projectId,
        },
      },
    });
  }

  async findOne(categoryId: string) {
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(categoryId: string, data: UpdateCategoryDto) {
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.categoryRepository.update(categoryId, {
      name: data.name,
      ...(data.name && { slug: generateSlug(data.name) }),
    });
  }

  async delete(categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.delete(categoryId);
  }

  async findByProjectId(projectId: string) {
    return this.categoryRepository.findByProjectId(projectId);
  }
}
