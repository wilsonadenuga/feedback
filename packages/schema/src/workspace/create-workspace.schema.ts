import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Workspace name is required')
    .max(100, 'Workspace name must not exceed 100 characters')
    .trim(),
  logo_url: z.url('Invalid logo URL').optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
