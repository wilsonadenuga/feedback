import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import { workspaceSchema } from './workspace.schema';
import { workspaceHandleSchema } from './workspace-handle.schema';

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Workspace name is required')
    .max(100, 'Workspace name must not exceed 100 characters')
    .trim()
    .optional(),
  handle: workspaceHandleSchema.optional(),
  logo_url: z.url('Invalid logo URL').optional().nullable(),
});

export const updateWorkspaceResponseSchema =
  successResponseSchema(workspaceSchema);

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type UpdateWorkspaceResponse = z.infer<
  typeof updateWorkspaceResponseSchema
>;
