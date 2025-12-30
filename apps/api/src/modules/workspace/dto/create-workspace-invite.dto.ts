import { createZodDto } from 'nestjs-zod';
import {
  createWorkspaceInviteSchema,
  createWorkspaceInviteResponseSchema,
} from '@feedback/schema';

export class CreateWorkspaceInviteDto extends createZodDto(
  createWorkspaceInviteSchema,
) {}

export class CreateWorkspaceInviteResponseDto extends createZodDto(
  createWorkspaceInviteResponseSchema,
) {}
