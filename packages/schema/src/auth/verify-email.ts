import { z } from 'zod';
import { userSchema } from '../user';
import { authTokensSchema } from './shared.schema';

// TODO: we will accept the token from the headers also, this will help with resend verification email,
export const verifyEmailSchema = z.object({
  email: z.email('Invalid email address').toLowerCase().trim(),
  code: z
    .string()
    .min(6, 'Code must be at least 6 characters')
    .max(10, 'Code must not exceed 10 characters'),
});


export const verifyEmailResponseSchema = z.object({
  user: userSchema,
  tokens: authTokensSchema,
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type VerifyEmailResponse = z.infer<typeof verifyEmailResponseSchema>;
