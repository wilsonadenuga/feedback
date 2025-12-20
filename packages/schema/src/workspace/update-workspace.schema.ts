import { z } from 'zod';

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Workspace name is required')
    .max(100, 'Workspace name must not exceed 100 characters')
    .trim()
    .optional(),
  logo_url: z.url('Invalid logo URL').optional().nullable(),
});

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
