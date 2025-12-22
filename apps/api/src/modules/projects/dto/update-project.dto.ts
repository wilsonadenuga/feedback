import { createZodDto } from 'nestjs-zod';
import { updateProjectSchema } from '@feedback/schema';

export class UpdateProjectDto extends createZodDto(updateProjectSchema) {}
