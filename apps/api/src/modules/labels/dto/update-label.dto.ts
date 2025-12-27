import { createZodDto } from 'nestjs-zod';
import { updateLabelSchema } from '@feedback/schema';

export class UpdateLabelDto extends createZodDto(updateLabelSchema) {}
