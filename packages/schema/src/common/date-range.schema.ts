import { z } from 'zod';

export const dateRangeSchema = z.object({
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
});

export type DateRange = z.infer<typeof dateRangeSchema>;
