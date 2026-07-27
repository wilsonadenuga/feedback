import { z } from 'zod';
import { emailSchema, uuidSchema } from '../common';

export const USER_STATUSES = {
  UNVERIFIED: 'UNVERIFIED',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  BANNED: 'BANNED',
} as const;

export const userStatusSchema = z.enum(USER_STATUSES);

export type UserStatus = z.infer<typeof userStatusSchema>;

export const userSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  name: z.string(),
  status: userStatusSchema,
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export type User = z.infer<typeof userSchema>;
