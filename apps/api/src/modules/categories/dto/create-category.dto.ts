import { createZodDto } from 'nestjs-zod';
import { createCategorySchema } from '@feedback/schema';

export class CreateCategoryDto extends createZodDto(createCategorySchema) {}
