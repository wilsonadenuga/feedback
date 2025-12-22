import { z } from 'zod';
import { uuidSchema } from '../common';

export const projectSchema = z.object({
  id: uuidSchema,
  workspace_id: uuidSchema,
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
