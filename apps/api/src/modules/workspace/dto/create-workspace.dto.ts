import { createZodDto } from 'nestjs-zod';
import {
  createWorkspaceSchema,
  createWorkspaceResponseSchema,
} from '@feedback/schema';

export class CreateWorkspaceDto extends createZodDto(createWorkspaceSchema) {}

export class CreateWorkspaceResponseDto extends createZodDto(
  createWorkspaceResponseSchema,
) {}
