import { createZodDto } from 'nestjs-zod';
import {
  createFeedbackSchema,
  createFeedbackResponseSchema,
} from '@feedback/schema';

export class CreateFeedbackDto extends createZodDto(createFeedbackSchema) {}

export class CreateFeedbackResponseDto extends createZodDto(
  createFeedbackResponseSchema,
) {}
