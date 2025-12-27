import { z } from 'zod';
import { uuidSchema } from '../common/uuid.schema';

export const categorySchema = z.object({
  id: uuidSchema,
  project_id: uuidSchema,
  name: z.string(),
  slug: z.string(),
  is_default: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Category = z.infer<typeof categorySchema>;
