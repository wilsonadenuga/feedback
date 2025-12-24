import { createZodDto } from 'nestjs-zod';
import { workspaceResponseSchema } from '@feedback/schema';

export class GetWorkspaceResponseDto extends createZodDto(
  workspaceResponseSchema,
) {}
