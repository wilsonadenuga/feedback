import { z } from 'zod';
import { emailSchema } from '../common';


export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: emailSchema,
});

export const registerResponseSchema = z.object({
  message: z.string(),
  expiresIn: z.number().int().positive(), // seconds until code expires
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
