import { z } from 'zod';
import { projectSchema } from './project.schema';
import { successResponseSchema } from '../common/response';

export const projectResponseSchema = successResponseSchema(projectSchema);

export const projectsResponseSchema = successResponseSchema(
  z.array(projectSchema),
);

export const projectDeleteResponseSchema = successResponseSchema(z.null());

export type ProjectResponse = z.infer<typeof projectResponseSchema>;
export type ProjectsResponse = z.infer<typeof projectsResponseSchema>;
export type ProjectDeleteResponse = z.infer<
  typeof projectDeleteResponseSchema
>;
