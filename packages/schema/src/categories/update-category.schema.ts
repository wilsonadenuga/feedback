import { z } from 'zod';

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must not exceed 50 characters')
    .trim()
    .optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
