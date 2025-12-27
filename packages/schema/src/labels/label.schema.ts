import { z } from 'zod';
import { uuidSchema } from '../common/uuid.schema';

export const labelSchema = z.object({
  id: uuidSchema,
  project_id: uuidSchema,
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  color: z.string().nullable(),
  is_default: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Label = z.infer<typeof labelSchema>;
