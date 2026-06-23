import { createZodDto } from 'nestjs-zod';
import { googleAuthResponseSchema } from '@feedback/schema';


export class GoogleAuthResponseDto extends createZodDto(
  googleAuthResponseSchema,
) {}