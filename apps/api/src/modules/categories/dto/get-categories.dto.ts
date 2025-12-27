import { createZodDto } from 'nestjs-zod';
import {
  getCategoriesQuerySchema,
  getCategoriesResponseSchema,
} from '@feedback/schema';

export class GetCategoriesQueryDto extends createZodDto(
  getCategoriesQuerySchema,
) {}

export class GetCategoriesResponseDto extends createZodDto(
  getCategoriesResponseSchema,
) {}
