import { z } from 'zod';
import { emailSchema } from '../common';

export const loginVerifySchema = z.object({
  email: emailSchema,
  code: z.string().length(6, 'Code must be 6 digits'),
});

export type LoginVerify = z.infer<typeof loginVerifySchema>;
