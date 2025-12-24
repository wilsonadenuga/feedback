import { createZodDto } from 'nestjs-zod';
import {
  createWorkspaceSchema,
  workspaceResponseSchema,
} from '@feedback/schema';

export class CreateWorkspaceDto extends createZodDto(createWorkspaceSchema) {}

export class CreateWorkspaceResponseDto extends createZodDto(
  workspaceResponseSchema,
) {}
