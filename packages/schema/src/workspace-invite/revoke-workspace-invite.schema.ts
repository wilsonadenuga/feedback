import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';

export const revokeWorkspaceInviteResponseSchema = successResponseSchema(
  z.null(),
);

export type RevokeWorkspaceInviteResponse = z.infer<
  typeof revokeWorkspaceInviteResponseSchema
>;
