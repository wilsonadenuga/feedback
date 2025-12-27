import { createZodDto } from 'nestjs-zod';
import { feedbackResponseSchema } from '@feedback/schema';

export class GetFeedbackResponseDto extends createZodDto(
  feedbackResponseSchema,
) {}
