import { createZodDto } from 'nestjs-zod';
import {
  acceptWorkspaceInviteSchema,
  acceptWorkspaceInviteResponseSchema,
} from '@feedback/schema';

export class AcceptWorkspaceInviteDto extends createZodDto(
  acceptWorkspaceInviteSchema,
) {}

export class AcceptWorkspaceInviteResponseDto extends createZodDto(
  acceptWorkspaceInviteResponseSchema,
) {}
