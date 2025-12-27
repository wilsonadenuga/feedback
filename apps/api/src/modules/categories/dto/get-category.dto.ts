import { createZodDto } from 'nestjs-zod';
import { getCategoryResponseSchema } from '@feedback/schema';

export class GetCategoryResponseDto extends createZodDto(
  getCategoryResponseSchema,
) {}
