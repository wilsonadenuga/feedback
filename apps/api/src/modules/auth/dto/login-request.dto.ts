import { createZodDto } from 'nestjs-zod';
import { loginRequestSchema } from '@feedback/schema';

export class LoginRequestDto extends createZodDto(loginRequestSchema) {}
