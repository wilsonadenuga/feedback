import { z } from 'zod';
import { workspaceSchema } from './workspace.schema';
import { successResponseSchema } from '../common/success-response.schema';

export const getWorkspaceResponseSchema = successResponseSchema(workspaceSchema);
export type GetWorkspaceResponse = z.infer<typeof getWorkspaceResponseSchema>;
