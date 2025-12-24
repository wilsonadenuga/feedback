import { createZodDto } from 'nestjs-zod';
import { updateProjectSchema, projectResponseSchema } from '@feedback/schema';

export class UpdateProjectDto extends createZodDto(updateProjectSchema) {}

export class UpdateProjectResponseDto extends createZodDto(
  projectResponseSchema,
) {}
