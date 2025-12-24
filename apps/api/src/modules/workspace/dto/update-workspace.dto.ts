import { createZodDto } from 'nestjs-zod';
import {
  updateWorkspaceSchema,
  workspaceResponseSchema,
} from '@feedback/schema';

export class UpdateWorkspaceDto extends createZodDto(updateWorkspaceSchema) {}

export class UpdateWorkspaceResponseDto extends createZodDto(
  workspaceResponseSchema,
) {}
