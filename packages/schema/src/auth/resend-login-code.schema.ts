import { z } from 'zod';

export const resendLoginCodeSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
});

export const resendLoginCodeResponseSchema = z.object({
  expires_in: z.number().int().positive(),
});

export type ResendLoginCodeInput = z.infer<typeof resendLoginCodeSchema>;
export type ResendLoginCodeResponse = z.infer<
  typeof resendLoginCodeResponseSchema
>;
