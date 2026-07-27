import { z } from 'zod';

export const TOKEN_TYPES = {
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  LOGIN_CODE: 'LOGIN_CODE',
  REFRESH: 'REFRESH',
  WORKSPACE_INVITE: 'WORKSPACE_INVITE',
} as const;

export const tokenTypeSchema = z.enum(TOKEN_TYPES);

export type TokenType = z.infer<typeof tokenTypeSchema>;
