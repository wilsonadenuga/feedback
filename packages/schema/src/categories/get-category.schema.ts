import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import { categorySchema } from './category.schema';

export const getCategoryResponseSchema = successResponseSchema(categorySchema);

export type GetCategoryResponse = z.infer<typeof getCategoryResponseSchema>;
