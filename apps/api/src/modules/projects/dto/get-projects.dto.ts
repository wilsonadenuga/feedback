import { createZodDto } from 'nestjs-zod';
import { getProjectsResponseSchema } from '@feedback/schema';

export class GetProjectsResponseDto extends createZodDto(
  getProjectsResponseSchema,
) {}
