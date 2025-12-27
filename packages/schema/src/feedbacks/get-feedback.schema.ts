import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import { feedbackSchema } from './feedback.schema';

export const getFeedbackResponseSchema = successResponseSchema(feedbackSchema);

export type GetFeedbackResponse = z.infer<typeof getFeedbackResponseSchema>;
