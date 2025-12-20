import { z } from 'zod';
import { uuidSchema } from '../common';
import { workspaceRoleSchema } from './role.schema';

export const workspaceMemberSchema = z.object({
  id: uuidSchema,
  workspace_id: uuidSchema,
  user_id: uuidSchema,
  role: workspaceRoleSchema,
  display_name: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type WorkspaceMember = z.infer<typeof workspaceMemberSchema>;
