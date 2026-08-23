import { z } from 'zod';
import { workspaceSchema } from './workspace.schema';
import { workspaceHandleSchema } from './workspace-handle.schema';
import { successResponseSchema } from '../common/success-response.schema';

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Workspace name is required')
    .max(100, 'Workspace name must not exceed 100 characters')
    .trim(),
  handle: workspaceHandleSchema,
  logo_url: z.url('Invalid logo URL').optional(),
});

export const createWorkspaceResponseSchema =
  successResponseSchema(workspaceSchema);

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type CreateWorkspaceResponse = z.infer<
  typeof createWorkspaceResponseSchema
>;
