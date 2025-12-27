import { z } from 'zod';
import { emailSchema } from '../common';

export const loginSchema = z.object({
  email: emailSchema,
});

export type Login = z.infer<typeof loginSchema>;
