import { createZodDto } from 'nestjs-zod';
import { projectResponseSchema } from '@feedback/schema';

export class GetProjectResponseDto extends createZodDto(
  projectResponseSchema,
) {}
