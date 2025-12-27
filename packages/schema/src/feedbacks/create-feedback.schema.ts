import { z } from 'zod';
import { uuidSchema } from '../common';
import { successResponseSchema } from '../common/success-response.schema';
import { feedbackSchema } from './feedback.schema';

export const createFeedbackSchema = z.object({
  project_id: uuidSchema,
  category_ids: z.array(uuidSchema).optional(),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  customer_id: z.string().optional(),
  customer_email: z.email('Invalid email address').optional(),
  customer_name: z
    .string()
    .max(100, 'Name must not exceed 100 characters')
    .optional(),
  customer_meta: z.any().optional(),
});

export const createFeedbackResponseSchema =
  successResponseSchema(feedbackSchema);

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type CreateFeedbackResponse = z.infer<
  typeof createFeedbackResponseSchema
>;
