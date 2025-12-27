import { createZodDto } from 'nestjs-zod';
import { getWorkspaceResponseSchema } from '@feedback/schema';

export class GetWorkspaceResponseDto extends createZodDto(
  getWorkspaceResponseSchema,
) {}
