import { z } from 'zod';

export const resendVerificationSchema = z.object({
  email: z.email('Invalid email address').toLowerCase().trim(),
});

export const resendVerificationResponseSchema = z.object({
  message: z.string(),
  expires_in: z.number().int().positive(),
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type ResendVerificationResponse = z.infer<typeof resendVerificationResponseSchema>;
