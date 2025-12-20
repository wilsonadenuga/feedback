import { z } from 'zod';
import { uuidSchema } from '../common';

export const workspaceSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  owner_user_id: uuidSchema,
  logo_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Workspace = z.infer<typeof workspaceSchema>;
export * from './create-workspace.schema';
export * from './update-workspace.schema';
