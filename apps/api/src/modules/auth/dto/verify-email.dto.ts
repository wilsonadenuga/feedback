import { createZodDto } from 'nestjs-zod';
import { verifyEmailSchema } from '@feedback/schema';

export class VerifyEmailDto extends createZodDto(verifyEmailSchema) {}
