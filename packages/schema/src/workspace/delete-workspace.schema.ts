import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';

export const deleteWorkspaceResponseSchema = successResponseSchema(z.null());
export type DeleteWorkspaceResponse = z.infer<
  typeof deleteWorkspaceResponseSchema
>;
