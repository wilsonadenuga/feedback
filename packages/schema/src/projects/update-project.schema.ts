import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import { projectSchema } from './project.schema';

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must not exceed 100 characters')
    .trim()
    .optional(),
  description: z.string().max(500, 'Description must not exceed 500 characters').optional().nullable(),
});

export const updateProjectResponseSchema = successResponseSchema(projectSchema);

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UpdateProjectResponse = z.infer<typeof updateProjectResponseSchema>;
