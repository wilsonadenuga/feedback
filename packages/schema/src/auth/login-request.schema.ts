import { z } from 'zod';
import { emailSchema } from '../common';

export const loginRequestSchema = z.object({
  email: emailSchema,
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
