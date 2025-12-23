import { createZodDto } from 'nestjs-zod';
import { updateCategorySchema } from '@feedback/schema';

export class UpdateCategoryDto extends createZodDto(updateCategorySchema) {}
