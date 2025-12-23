import { z } from 'zod';
import { categorySchema } from './category.schema';
import { successResponseSchema } from '../common/response';

export const categoryResponseSchema = successResponseSchema(categorySchema);

export const categoriesResponseSchema = successResponseSchema(
  z.array(categorySchema),
);

export const categoryDeleteResponseSchema = successResponseSchema(z.null());

export type CategoryResponse = z.infer<typeof categoryResponseSchema>;
export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;
export type CategoryDeleteResponse = z.infer<
  typeof categoryDeleteResponseSchema
>;
