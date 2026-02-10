import { createZodDto } from 'nestjs-zod';
import {
  resendLoginCodeSchema,
  resendLoginCodeResponseSchema,
} from '@feedback/schema';

export class ResendLoginCodeDto extends createZodDto(resendLoginCodeSchema) {}
export class ResendLoginCodeResponseDto extends createZodDto(
  resendLoginCodeResponseSchema,
) {}
