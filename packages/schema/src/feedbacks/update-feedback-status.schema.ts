import { z } from 'zod';
import { feedbackStatusSchema } from './feedback-status.schema';

export const updateFeedbackStatusSchema = z.object({
  status: feedbackStatusSchema,
});

export type UpdateFeedbackStatus = z.infer<typeof updateFeedbackStatusSchema>;
