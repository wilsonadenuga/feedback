import { z } from 'zod';

export const validationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(validationErrorSchema).optional(),
  data: z.null(),
});

export type ValidationError = {
  field: string;
  message: string;
};

export type ErrorResponse = {
  success: false;
  message: string;
  errors?: ValidationError[];
  data: null;
};
