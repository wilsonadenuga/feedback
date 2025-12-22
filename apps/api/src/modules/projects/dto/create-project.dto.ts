import { createZodDto } from 'nestjs-zod';
import { createProjectSchema } from '@feedback/schema';

export class CreateProjectDto extends createZodDto(createProjectSchema) {}
