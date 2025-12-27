import { z } from 'zod';

export const paginationMetaSchema = z.object({
  page: z.number().int().positive(),
  per_page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  total_pages: z.number().int().nonnegative(),
});

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    message: z.string(),
    data: dataSchema,
  });

export const paginatedDataSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    meta: paginationMetaSchema,
  });

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
) => successResponseSchema(paginatedDataSchema(itemSchema));

export type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export type PaginatedData<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type PaginatedResponse<T> = SuccessResponse<PaginatedData<T>>;
