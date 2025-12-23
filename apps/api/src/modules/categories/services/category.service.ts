import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(projectId: string, data: CreateCategoryDto) {
    return this.categoryRepository.create(projectId, data);
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

    return this.categoryRepository.update(categoryId, data);
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
