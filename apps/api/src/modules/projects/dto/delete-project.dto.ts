import { createZodDto } from 'nestjs-zod';
import { projectDeleteResponseSchema } from '@feedback/schema';

export class DeleteProjectResponseDto extends createZodDto(
  projectDeleteResponseSchema,
) {}
