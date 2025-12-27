import { createZodDto } from 'nestjs-zod';
import { createLabelSchema } from '@feedback/schema';

export class CreateLabelDto extends createZodDto(createLabelSchema) {}
