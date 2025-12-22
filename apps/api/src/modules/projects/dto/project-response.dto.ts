import { createZodDto } from 'nestjs-zod';
import {
  projectResponseSchema,
  projectsResponseSchema,
  projectDeleteResponseSchema,
} from '@feedback/schema';

export class ProjectResponseDto extends createZodDto(projectResponseSchema) {}

export class ProjectsResponseDto extends createZodDto(projectsResponseSchema) {}

export class ProjectDeleteResponseDto extends createZodDto(
  projectDeleteResponseSchema,
) {}
