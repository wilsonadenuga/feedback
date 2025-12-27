import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import { projectSchema } from './project.schema';

export const getProjectResponseSchema = successResponseSchema(projectSchema);

export type GetProjectResponse = z.infer<typeof getProjectResponseSchema>;
