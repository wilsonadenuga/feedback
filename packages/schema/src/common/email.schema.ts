import { z } from 'zod';

export const emailSchema = z
  .email('Invalid email address')
  .toLowerCase()
  .trim();

export type Email = z.infer<typeof emailSchema>;
