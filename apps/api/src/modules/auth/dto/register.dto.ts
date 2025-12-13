import { createZodDto } from 'nestjs-zod';
import { registerSchema } from '@feedback/schema';

export class RegisterDto extends createZodDto(registerSchema) {}
