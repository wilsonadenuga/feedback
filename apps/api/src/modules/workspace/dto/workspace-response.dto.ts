import { createZodDto } from 'nestjs-zod';
import {
  workspaceResponseSchema,
  workspacesResponseSchema,
  workspaceDeleteResponseSchema,
} from '@feedback/schema';

export class WorkspaceResponseDto extends createZodDto(
  workspaceResponseSchema,
) {}

export class WorkspacesResponseDto extends createZodDto(
  workspacesResponseSchema,
) {}

export class WorkspaceDeleteResponseDto extends createZodDto(
  workspaceDeleteResponseSchema,
) {}
