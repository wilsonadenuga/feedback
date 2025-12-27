import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import { projectSchema } from './project.schema';
import { uuidSchema } from '../common/uuid.schema';

export const getProjectsQuerySchema = z.object({
  workspace_id: uuidSchema,
});

export const getProjectsResponseSchema = successResponseSchema(
  z.array(projectSchema),
);

export type GetProjectsQuery = z.infer<typeof getProjectsQuerySchema>;
export type GetProjectsResponse = z.infer<typeof getProjectsResponseSchema>;
