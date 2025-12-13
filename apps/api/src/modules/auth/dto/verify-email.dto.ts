import { createZodDto } from 'nestjs-zod';
import { verifyEmailSchema, verifyEmailResponseSchema } from '@feedback/schema';

export class VerifyEmailDto extends createZodDto(verifyEmailSchema) {}
export class VerifyEmailResponseDto extends createZodDto(
  verifyEmailResponseSchema,
) {}
