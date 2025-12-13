import { z } from 'zod';
import { userSchema } from '../user';
import { authTokensSchema } from './shared.schema';

// TODO: we will accept the token from the headers also, this will help with resend verification email,
export const confirmEmailSchema = z.object({
  email: z.email('Invalid email address').toLowerCase().trim(),
  code: z
    .string()
    .min(6, 'Code must be at least 6 characters')
    .max(10, 'Code must not exceed 10 characters'),
});


export const confirmEmailResponseSchema = z.object({
  user: userSchema,
  tokens: authTokensSchema,
});

export type ConfirmEmailInput = z.infer<typeof confirmEmailSchema>;
export type ConfirmEmailResponse = z.infer<typeof confirmEmailResponseSchema>;
