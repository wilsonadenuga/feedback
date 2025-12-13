import { z } from 'zod';

export const uuidSchema = z.uuid('Invalid UUID');

export type UUID = z.infer<typeof uuidSchema>;
