import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';

export const deleteProjectResponseSchema = successResponseSchema(z.null());

export type DeleteProjectResponse = z.infer<typeof deleteProjectResponseSchema>;
