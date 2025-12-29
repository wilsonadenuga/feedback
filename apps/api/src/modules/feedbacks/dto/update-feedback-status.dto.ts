import { createZodDto } from 'nestjs-zod';
import { updateFeedbackStatusSchema } from '@feedback/schema';

export class UpdateFeedbackStatusDto extends createZodDto(
  updateFeedbackStatusSchema,
) {}
