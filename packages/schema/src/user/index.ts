import { z } from 'zod';
import { emailSchema, uuidSchema } from '../common';

export const USER_STATUSES = {
  UNVERIFIED: 'UNVERIFIED',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  BANNED: 'BANNED',
} as const;

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

export const userStatusSchema = z.enum([
  'UNVERIFIED',
  'ACTIVE',
  'SUSPENDED',
  'BANNED',
]);

export const userSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  name: z.string(),
  status: userStatusSchema,
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export type User = z.infer<typeof userSchema>;
