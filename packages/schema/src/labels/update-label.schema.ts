import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import { labelSchema } from './label.schema';

export const updateLabelSchema = z.object({
  name: z
    .string()
    .min(1, 'Label name is required')
    .max(50, 'Label name must not exceed 50 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(200, 'Description must not exceed 200 characters')
    .optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color must be a valid hex color code')
    .optional(),
});

export const updateLabelResponseSchema = successResponseSchema(labelSchema);

export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;
export type UpdateLabelResponse = z.infer<typeof updateLabelResponseSchema>;
