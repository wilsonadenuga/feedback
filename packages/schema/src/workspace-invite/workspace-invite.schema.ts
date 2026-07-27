import { z } from 'zod';
import { uuidSchema } from '../common';
import { workspaceRoleSchema } from '../workspace-member/role.schema';

/**
 * Invite status
 * - PENDING: Invite has been sent and is waiting for acceptance
 * - ACCEPTED: User has accepted the invite
 * - REVOKED: Invite was cancelled by the inviter
 * - EXPIRED: Invite has expired
 */
export const INVITE_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REVOKED: 'REVOKED',
  EXPIRED: 'EXPIRED',
} as const;

export const inviteStatusSchema = z.enum(INVITE_STATUSES);

export type InviteStatus = z.infer<typeof inviteStatusSchema>;

export const workspaceInviteSchema = z.object({
  id: uuidSchema,
  workspace_id: uuidSchema,
  email: z.string(),
  role: workspaceRoleSchema,
  invited_by_user_id: uuidSchema,
  status: inviteStatusSchema,
  created_at: z.string(),
  updated_at: z.string(),
});

export type WorkspaceInvite = z.infer<typeof workspaceInviteSchema>;
