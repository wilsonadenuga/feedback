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

export type FeedbackStatus =
  (typeof FEEDBACK_STATUSES)[keyof typeof FEEDBACK_STATUSES];

export const feedbackStatusSchema = z.enum([
  'PENDING',
  'REVIEW',
  'PLANNED',
  'IN_PROGRESS',
  'COMPLETED',
  'DECLINED',
  'DUPLICATE',
]);
