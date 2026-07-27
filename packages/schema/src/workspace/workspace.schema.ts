import { z } from 'zod';
import { uuidSchema } from '../common';

export const workspaceSchema = z.object({
  id: uuidSchema,
  slug: z.string(),
  name: z.string(),
  owner_user_id: uuidSchema,
  logo_url: z.string().nullable(),
  member_count: z.number().int().nonnegative(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Workspace = z.infer<typeof workspaceSchema>;
