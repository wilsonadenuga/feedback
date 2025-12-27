import { createZodDto } from 'nestjs-zod';
import {
  getProjectsQuerySchema,
  getProjectsResponseSchema,
} from '@feedback/schema';

export class GetProjectsQueryDto extends createZodDto(getProjectsQuerySchema) {}

export class GetProjectsResponseDto extends createZodDto(
  getProjectsResponseSchema,
) {}
