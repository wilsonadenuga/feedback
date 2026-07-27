import { z } from 'zod';

export const MFA_TYPES = {
  TOTP: 'TOTP',
} as const;

export const mfaTypeSchema = z.enum(MFA_TYPES);

export type MfaType = z.infer<typeof mfaTypeSchema>;
