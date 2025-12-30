import { z } from 'zod';
import { uuidSchema, emailSchema } from '../common';
import { workspaceRoleSchema } from '../workspace-member/role.schema';
import { successResponseSchema } from '../common/success-response.schema';
import { workspaceInviteSchema } from './workspace-invite.schema';

export const createWorkspaceInviteSchema = z.object({
  workspace_id: uuidSchema,
  email: emailSchema,
  role: workspaceRoleSchema,
});

export const createWorkspaceInviteResponseSchema = successResponseSchema(
  workspaceInviteSchema,
);

export type CreateWorkspaceInviteInput = z.infer<
  typeof createWorkspaceInviteSchema
>;
export type CreateWorkspaceInviteResponse = z.infer<
  typeof createWorkspaceInviteResponseSchema
>;
