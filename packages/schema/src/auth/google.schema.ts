import { z } from 'zod';
import { userSchema } from '../user';
import { authTokensSchema } from './shared.schema';
import { workspaceSchema } from '../workspace/workspace.schema';


export const googleAuthResponseSchema = z.object({
  user: userSchema,
  tokens: authTokensSchema,
  workspaces: z.array(workspaceSchema),
});

export type GoogleAuthResponse = z.infer<typeof googleAuthResponseSchema>;
