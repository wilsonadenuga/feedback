import { z } from 'zod';
import { uuidSchema } from '../common';

export const createCategorySchema = z.object({
  project_id: uuidSchema,
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must not exceed 50 characters')
    .trim(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
