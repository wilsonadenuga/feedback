import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import { categorySchema } from './category.schema';

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must not exceed 50 characters')
    .trim()
    .optional(),
});

export const updateCategoryResponseSchema = successResponseSchema(categorySchema);

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type UpdateCategoryResponse = z.infer<typeof updateCategoryResponseSchema>;
