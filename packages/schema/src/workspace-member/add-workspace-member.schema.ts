import { z } from 'zod';
import { uuidSchema } from '../common';

export const addWorkspaceMemberSchema = z.object({
  user_id: uuidSchema,
  role: z.string().min(1, 'Role is required'),
  display_name: z.string().optional(),
});

export type AddWorkspaceMemberInput = z.infer<typeof addWorkspaceMemberSchema>;
