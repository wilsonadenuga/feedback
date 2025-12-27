import { z } from 'zod';
import { uuidSchema } from '../common';
import { successResponseSchema } from '../common/success-response.schema';
import { categorySchema } from './category.schema';

export const createCategorySchema = z.object({
  project_id: uuidSchema,
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must not exceed 50 characters')
    .trim(),
});

export const createCategoryResponseSchema = successResponseSchema(categorySchema);

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateCategoryResponse = z.infer<typeof createCategoryResponseSchema>;
