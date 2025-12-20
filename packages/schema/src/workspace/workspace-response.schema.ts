import { z } from 'zod';
import { workspaceSchema } from './workspace.schema';
import { successResponseSchema } from '../common/response';

export const workspaceResponseSchema = successResponseSchema(workspaceSchema);

export const workspacesResponseSchema = successResponseSchema(
  z.array(workspaceSchema),
);

export const workspaceDeleteResponseSchema = successResponseSchema(z.null());

export type WorkspaceResponse = z.infer<typeof workspaceResponseSchema>;
export type WorkspacesResponse = z.infer<typeof workspacesResponseSchema>;
export type WorkspaceDeleteResponse = z.infer<
  typeof workspaceDeleteResponseSchema
>;
