import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';
import { workspaceSchema } from './workspace.schema';

export const getWorkspacesResponseSchema = successResponseSchema(
  z.array(workspaceSchema),
);

export type GetWorkspacesResponse = z.infer<typeof getWorkspacesResponseSchema>;
