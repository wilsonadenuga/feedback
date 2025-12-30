import { createZodDto } from 'nestjs-zod';
import {
  getWorkspaceInvitesQuerySchema,
  getWorkspaceInvitesResponseSchema,
} from '@feedback/schema';

export class GetWorkspaceInvitesQueryDto extends createZodDto(
  getWorkspaceInvitesQuerySchema,
) {}

export class GetWorkspaceInvitesResponseDto extends createZodDto(
  getWorkspaceInvitesResponseSchema,
) {}
