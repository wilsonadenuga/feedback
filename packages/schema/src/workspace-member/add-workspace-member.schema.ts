import { z } from 'zod';
import { uuidSchema } from '../common';
import { workspaceRoleSchema } from './role.schema';

export const addWorkspaceMemberSchema = z.object({
  user_id: uuidSchema,
  role: workspaceRoleSchema,
  display_name: z.string().optional(),
});

export type AddWorkspaceMemberInput = z.infer<typeof addWorkspaceMemberSchema>;
