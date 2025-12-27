import { createZodDto } from 'nestjs-zod';
import {
  createProjectSchema,
  createProjectResponseSchema,
} from '@feedback/schema';

export class CreateProjectDto extends createZodDto(createProjectSchema) {}

export class CreateProjectResponseDto extends createZodDto(
  createProjectResponseSchema,
) {}
