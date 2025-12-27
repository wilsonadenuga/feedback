import { createZodDto } from 'nestjs-zod';
import { deleteProjectResponseSchema } from '@feedback/schema';

export class DeleteProjectResponseDto extends createZodDto(
  deleteProjectResponseSchema,
) {}
