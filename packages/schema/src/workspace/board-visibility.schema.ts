import { z } from 'zod';

export const BOARD_VISIBILITY = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
} as const;

export type BoardVisibility =
  (typeof BOARD_VISIBILITY)[keyof typeof BOARD_VISIBILITY];

export const boardVisibilitySchema = z.enum(['PUBLIC', 'PRIVATE']);
