import { z } from 'zod';
import { uuidSchema } from '../common';
import { labelSchema } from '../labels/label.schema';
import { feedbackStatusSchema } from './feedback-status.schema';

export const feedbackSchema = z.object({
  id: uuidSchema,
  workspace_id: uuidSchema,
  author_id: uuidSchema,
  title: z.string(),
  description: z.string().nullable(),
  status: feedbackStatusSchema,
  status_changed_at: z.string().nullable(),
  vote_count: z.number().int().nonnegative(),
  merged_into_id: uuidSchema.nullable(),
  labels: z.array(labelSchema),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Feedback = z.infer<typeof feedbackSchema>;
