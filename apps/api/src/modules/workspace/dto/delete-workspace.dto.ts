import { createZodDto } from 'nestjs-zod';
import { workspaceDeleteResponseSchema } from '@feedback/schema';

export class DeleteWorkspaceResponseDto extends createZodDto(
  workspaceDeleteResponseSchema,
) {}
