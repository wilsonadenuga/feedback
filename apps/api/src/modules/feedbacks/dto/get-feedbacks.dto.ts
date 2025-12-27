import { createZodDto } from 'nestjs-zod';
import {
  getFeedbacksQuerySchema,
  getFeedbacksResponseSchema,
} from '@feedback/schema';

export class GetFeedbacksDto extends createZodDto(getFeedbacksQuerySchema) {}

export class GetFeedbacksResponseDto extends createZodDto(
  getFeedbacksResponseSchema,
) {}
