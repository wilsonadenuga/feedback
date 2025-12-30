import { z } from 'zod';
import { successResponseSchema } from '../common/success-response.schema';

export const acceptWorkspaceInviteSchema = z.object({
  token: z.string().min(1),
  display_name: z.string().min(1).max(100),
});

export const acceptWorkspaceInviteResponseSchema = successResponseSchema(
  z.object({
    user: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string(),
    }),
    workspace: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
);

export type AcceptWorkspaceInviteInput = z.infer<
  typeof acceptWorkspaceInviteSchema
>;
export type AcceptWorkspaceInviteResponse = z.infer<
  typeof acceptWorkspaceInviteResponseSchema
>;
