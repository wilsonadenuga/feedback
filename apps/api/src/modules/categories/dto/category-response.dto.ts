import { createZodDto } from 'nestjs-zod';
import {
  categoryResponseSchema,
  categoriesResponseSchema,
  categoryDeleteResponseSchema,
} from '@feedback/schema';

export class CategoryResponseDto extends createZodDto(categoryResponseSchema) {}

export class CategoriesResponseDto extends createZodDto(
  categoriesResponseSchema,
) {}

export class CategoryDeleteResponseDto extends createZodDto(
  categoryDeleteResponseSchema,
) {}
