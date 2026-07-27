import { z } from 'zod';
import { uuidSchema } from '../common';
import { successResponseSchema } from '../common/success-response.schema';
import {
  workspaceInviteSchema,
  inviteStatusSchema,
} from './workspace-invite.schema';

export const getWorkspaceInvitesQuerySchema = z.object({
  workspace_id: uuidSchema,
  status: inviteStatusSchema.optional(),
});

export const getWorkspaceInvitesResponseSchema = successResponseSchema(
  z.array(workspaceInviteSchema),
);

export type GetWorkspaceInvitesQuery = z.infer<
  typeof getWorkspaceInvitesQuerySchema
>;
export type GetWorkspaceInvitesResponse = z.infer<
  typeof getWorkspaceInvitesResponseSchema
>;
