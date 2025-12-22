import { z } from 'zod';

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must not exceed 100 characters')
    .trim()
    .optional(),
  description: z.string().max(500, 'Description must not exceed 500 characters').optional().nullable(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
