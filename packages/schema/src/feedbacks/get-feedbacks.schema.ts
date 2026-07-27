import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import {
  paginationQuerySchema,
  paginationResponseSchema,
} from '../common/pagination.schema';
import { feedbackSchema } from './feedback.schema';
import { feedbackStatusSchema } from './feedback-status.schema';
import { uuidSchema } from '../common/uuid.schema';

export const getFeedbacksQuerySchema = paginationQuerySchema.extend({
  workspace_id: uuidSchema,
  label_id: uuidSchema.optional(),
  status: feedbackStatusSchema.optional(),
  search: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc').optional(),
});

export const getFeedbacksResponseSchema = successResponseSchema(
  z.object({
    data: z.array(feedbackSchema),
    pagination: paginationResponseSchema,
  }),
);

export type GetFeedbacksQuery = z.infer<typeof getFeedbacksQuerySchema>;
export type GetFeedbacksResponse = z.infer<typeof getFeedbacksResponseSchema>;
