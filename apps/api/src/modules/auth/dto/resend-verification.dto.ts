import { createZodDto } from 'nestjs-zod';
import {
  resendVerificationSchema,
  resendVerificationResponseSchema,
} from '@feedback/schema';

export class ResendVerificationDto extends createZodDto(
  resendVerificationSchema,
) {}
export class ResendVerificationResponseDto extends createZodDto(
  resendVerificationResponseSchema,
) {}
