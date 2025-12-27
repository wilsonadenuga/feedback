import { z } from 'zod';
import { uuidSchema } from '../common';
import { successResponseSchema } from '../common/success-response.schema';
import { projectSchema } from './project.schema';

export const createProjectSchema = z.object({
  workspace_id: uuidSchema,
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must not exceed 100 characters')
    .trim(),
  description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
});

export const createProjectResponseSchema = successResponseSchema(projectSchema);

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateProjectResponse = z.infer<typeof createProjectResponseSchema>;
