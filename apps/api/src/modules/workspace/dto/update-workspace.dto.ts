import { createZodDto } from 'nestjs-zod';
import {
  updateWorkspaceSchema,
  updateWorkspaceResponseSchema,
} from '@feedback/schema';

export class UpdateWorkspaceDto extends createZodDto(updateWorkspaceSchema) {}

export class UpdateWorkspaceResponseDto extends createZodDto(
  updateWorkspaceResponseSchema,
) {}
