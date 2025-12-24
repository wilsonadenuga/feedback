import { createZodDto } from 'nestjs-zod';
import { projectsResponseSchema } from '@feedback/schema';

export class GetProjectsResponseDto extends createZodDto(
  projectsResponseSchema,
) {}
