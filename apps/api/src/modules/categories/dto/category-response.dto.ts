import { createZodDto } from 'nestjs-zod';
import {
  getCategoryResponseSchema,
  getCategoriesResponseSchema,
  deleteCategoryResponseSchema,
} from '@feedback/schema';

export class CategoryResponseDto extends createZodDto(
  getCategoryResponseSchema,
) {}

export class CategoriesResponseDto extends createZodDto(
  getCategoriesResponseSchema,
) {}

export class CategoryDeleteResponseDto extends createZodDto(
  deleteCategoryResponseSchema,
) {}
