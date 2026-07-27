import { z } from 'zod';

export const TOKEN_TYPES = {
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  LOGIN_CODE: 'LOGIN_CODE',
  REFRESH: 'REFRESH',
  WORKSPACE_INVITE: 'WORKSPACE_INVITE',
} as const;

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];

export const tokenTypeSchema = z.enum([
  'EMAIL_VERIFICATION',
  'LOGIN_CODE',
  'REFRESH',
  'WORKSPACE_INVITE',
]);
