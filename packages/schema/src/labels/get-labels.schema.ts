import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import { labelSchema } from './label.schema';
import { uuidSchema } from '../common/uuid.schema';

export const getLabelsQuerySchema = z.object({
  project_id: uuidSchema,
});

export const getLabelsResponseSchema = successResponseSchema(
  z.array(labelSchema),
);

export type GetLabelsQuery = z.infer<typeof getLabelsQuerySchema>;
export type GetLabelsResponse = z.infer<typeof getLabelsResponseSchema>;
