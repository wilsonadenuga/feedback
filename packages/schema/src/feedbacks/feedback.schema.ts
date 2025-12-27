import { z } from 'zod';
import { uuidSchema } from '../common';
import { labelSchema } from '../labels/label.schema';

export const feedbackSchema = z.object({
  id: uuidSchema,
  project_id: uuidSchema,
  title: z.string(),
  description: z.string().nullable(),
  status: z.string(),
  customer_id: z.string().nullable(),
  customer_email: z.string().nullable(),
  customer_name: z.string().nullable(),
  customer_meta: z.any().nullable(),
  labels: z.array(labelSchema),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Feedback = z.infer<typeof feedbackSchema>;
