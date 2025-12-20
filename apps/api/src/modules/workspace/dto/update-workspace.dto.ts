import { createZodDto } from 'nestjs-zod';
import { updateWorkspaceSchema } from '@feedback/schema';

export class UpdateWorkspaceDto extends createZodDto(updateWorkspaceSchema) {}
