import { createZodDto } from 'nestjs-zod';
import { workspacesResponseSchema } from '@feedback/schema';

export class GetWorkspacesResponseDto extends createZodDto(
  workspacesResponseSchema,
) {}
