import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import { categorySchema } from './category.schema';
import { uuidSchema } from '../common/uuid.schema';

export const getCategoriesQuerySchema = z.object({
  project_id: uuidSchema,
});

export const getCategoriesResponseSchema = successResponseSchema(
  z.array(categorySchema),
);

export type GetCategoriesQuery = z.infer<typeof getCategoriesQuerySchema>;
export type GetCategoriesResponse = z.infer<typeof getCategoriesResponseSchema>;
