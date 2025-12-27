import { createZodDto } from 'nestjs-zod';
import { deleteWorkspaceResponseSchema } from '@feedback/schema';

export class DeleteWorkspaceResponseDto extends createZodDto(
  deleteWorkspaceResponseSchema,
) {}
