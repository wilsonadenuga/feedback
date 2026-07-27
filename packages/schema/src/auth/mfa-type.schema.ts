import { z } from 'zod';

export const MFA_TYPES = {
  TOTP: 'TOTP',
} as const;

export type MfaType = (typeof MFA_TYPES)[keyof typeof MFA_TYPES];

export const mfaTypeSchema = z.enum(['TOTP']);
