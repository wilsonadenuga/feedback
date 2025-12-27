import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import { projectSchema } from './project.schema';

export const getProjectsResponseSchema = successResponseSchema(
  z.array(projectSchema),
);

export type GetProjectsResponse = z.infer<typeof getProjectsResponseSchema>;
