import { createZodDto } from 'nestjs-zod';
import { createWorkspaceSchema } from '@feedback/schema';

export class CreateWorkspaceDto extends createZodDto(createWorkspaceSchema) {}
