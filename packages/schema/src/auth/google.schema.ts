import { z } from 'zod';
import { userSchema } from '../user';

export const googleAuthResponseSchema = z.object({
  user: userSchema,
  jwtAccessToken: z.string(),
  jwtRefreshToken: z.string(),
});

export type GoogleAuthResponse = z.infer<typeof googleAuthResponseSchema>;