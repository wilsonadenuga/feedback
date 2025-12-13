import { createZodDto } from 'nestjs-zod';
import { registerSchema, registerResponseSchema } from '@feedback/schema';

export class RegisterDto extends createZodDto(registerSchema) {}

export class RegisterResponseDto extends createZodDto(registerResponseSchema) {}
