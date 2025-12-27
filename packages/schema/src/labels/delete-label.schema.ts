import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';

export const deleteLabelResponseSchema = successResponseSchema(z.null());

export type DeleteLabelResponse = z.infer<typeof deleteLabelResponseSchema>;
