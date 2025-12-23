import { z } from 'zod';
import { uuidSchema } from '../common';

export const categorySchema = z.object({
  id: uuidSchema,
  project_id: uuidSchema,
  name: z.string(),
  is_default: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Category = z.infer<typeof categorySchema>;
