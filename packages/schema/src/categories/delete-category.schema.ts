import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';

export const deleteCategoryResponseSchema = successResponseSchema(z.null());

export type DeleteCategoryResponse = z.infer<typeof deleteCategoryResponseSchema>;
