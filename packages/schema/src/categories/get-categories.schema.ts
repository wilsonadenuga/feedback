import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import { categorySchema } from './category.schema';

export const getCategoriesResponseSchema = successResponseSchema(
  z.array(categorySchema),
);

export type GetCategoriesResponse = z.infer<typeof getCategoriesResponseSchema>;
