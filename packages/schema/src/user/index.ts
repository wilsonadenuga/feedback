import { z } from 'zod';
import { emailSchema, uuidSchema } from '../common';

export const userSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  name: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type User = z.infer<typeof userSchema>;