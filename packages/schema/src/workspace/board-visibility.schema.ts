import { z } from 'zod';

export const BOARD_VISIBILITY = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
} as const;

export const boardVisibilitySchema = z.enum(BOARD_VISIBILITY);

export type BoardVisibility = z.infer<typeof boardVisibilitySchema>;
