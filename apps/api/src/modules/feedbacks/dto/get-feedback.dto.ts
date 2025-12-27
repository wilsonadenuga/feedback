import { createZodDto } from 'nestjs-zod';
import { getFeedbackResponseSchema } from '@feedback/schema';

export class GetFeedbackResponseDto extends createZodDto(
  getFeedbackResponseSchema,
) {}
