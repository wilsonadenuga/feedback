import { createZodDto } from 'nestjs-zod';
import {
  updateProjectSchema,
  updateProjectResponseSchema,
} from '@feedback/schema';

export class UpdateProjectDto extends createZodDto(updateProjectSchema) {}

export class UpdateProjectResponseDto extends createZodDto(
  updateProjectResponseSchema,
) {}
