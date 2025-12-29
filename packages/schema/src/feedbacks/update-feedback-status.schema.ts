import { z } from 'zod';

/**
 * Feedback status enum
 * - OPEN: Default status when feedback is created
 * - IN_PROGRESS: Feedback is being worked on
 * - RESOLVED: Feedback has been addressed
 * - CLOSED: Feedback is closed/archived
 */
export const feedbackStatusEnum = z.enum([
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
]);

export const updateFeedbackStatusSchema = z.object({
  status: feedbackStatusEnum,
});

export type UpdateFeedbackStatus = z.infer<typeof updateFeedbackStatusSchema>;
export type FeedbackStatus = z.infer<typeof feedbackStatusEnum>;
