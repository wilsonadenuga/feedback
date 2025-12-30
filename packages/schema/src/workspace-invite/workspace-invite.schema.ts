import { z } from 'zod';
import { uuidSchema } from '../common';
import { workspaceRoleSchema } from '../workspace-member/role.schema';

/**
 * Workspace invite status enum
 * - PENDING: Invite has been sent and is waiting for acceptance
 * - ACCEPTED: User has accepted the invite
 * - REVOKED: Invite was cancelled by the inviter
 * - EXPIRED: Invite has expired
 */
export const workspaceInviteStatusEnum = z.enum([
  'PENDING',
  'ACCEPTED',
  'REVOKED',
  'EXPIRED',
]);

export const workspaceInviteSchema = z.object({
  id: uuidSchema,
  workspace_id: uuidSchema,
  email: z.string(),
  role: workspaceRoleSchema,
  invited_by_user_id: uuidSchema,
  status: workspaceInviteStatusEnum,
  created_at: z.string(),
  updated_at: z.string(),
});

export type WorkspaceInvite = z.infer<typeof workspaceInviteSchema>;
export type WorkspaceInviteStatus = z.infer<typeof workspaceInviteStatusEnum>;
