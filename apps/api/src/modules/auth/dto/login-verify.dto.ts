import { createZodDto } from 'nestjs-zod';
import { loginVerifySchema } from '@feedback/schema';

export class LoginVerifyDto extends createZodDto(loginVerifySchema) {}
