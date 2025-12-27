import { createZodDto } from 'nestjs-zod';
import { createFeedbackSchema, feedbackResponseSchema } from '@feedback/schema';

export class CreateFeedbackDto extends createZodDto(createFeedbackSchema) {}

export class CreateFeedbackResponseDto extends createZodDto(
  feedbackResponseSchema,
) {}
