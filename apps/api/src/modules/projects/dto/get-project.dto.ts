import { createZodDto } from 'nestjs-zod';
import { getProjectResponseSchema } from '@feedback/schema';

export class GetProjectResponseDto extends createZodDto(
  getProjectResponseSchema,
) {}
