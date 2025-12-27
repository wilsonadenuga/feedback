import { createZodDto } from 'nestjs-zod';
import {
  getFeedbacksQuerySchema,
  feedbacksResponseSchema,
} from '@feedback/schema';

export class GetFeedbacksDto extends createZodDto(getFeedbacksQuerySchema) {}

export class GetFeedbacksResponseDto extends createZodDto(
  feedbacksResponseSchema,
) {}
