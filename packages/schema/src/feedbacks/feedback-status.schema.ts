import { z } from 'zod';

export const FEEDBACK_STATUSES = {
  PENDING: 'PENDING',
  REVIEW: 'REVIEW',
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  DECLINED: 'DECLINED',
  DUPLICATE: 'DUPLICATE',
} as const;

export const feedbackStatusSchema = z.enum(FEEDBACK_STATUSES);

export type FeedbackStatus = z.infer<typeof feedbackStatusSchema>;
