import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import { labelSchema } from './label.schema';

export const getLabelResponseSchema = successResponseSchema(labelSchema);

export type GetLabelResponse = z.infer<typeof getLabelResponseSchema>;
