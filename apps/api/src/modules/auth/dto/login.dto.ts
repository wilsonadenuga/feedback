import { createZodDto } from 'nestjs-zod';
import { loginSchema } from '@feedback/schema';

export class LoginDto extends createZodDto(loginSchema) {}
