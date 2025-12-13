import { z } from 'zod';


export const emailSchema = z
  .string()
  .email('Invalid email address')
  .toLowerCase()
  .trim();

export type Email = z.infer<typeof emailSchema>;
