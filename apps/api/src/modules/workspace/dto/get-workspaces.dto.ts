import { createZodDto } from 'nestjs-zod';
import { getWorkspacesResponseSchema } from '@feedback/schema';

export class GetWorkspacesResponseDto extends createZodDto(
  getWorkspacesResponseSchema,
) {}
