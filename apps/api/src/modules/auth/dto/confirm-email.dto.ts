import { createZodDto } from 'nestjs-zod';
import {
  confirmEmailSchema,
  confirmEmailResponseSchema,
} from '@feedback/schema';

export class ConfirmEmailDto extends createZodDto(confirmEmailSchema) {}
export class ConfirmEmailResponseDto extends createZodDto(
  confirmEmailResponseSchema,
) {}
