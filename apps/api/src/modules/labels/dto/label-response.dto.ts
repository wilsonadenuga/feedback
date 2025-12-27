import { createZodDto } from 'nestjs-zod';
import {
  getLabelResponseSchema,
  getLabelsResponseSchema,
  deleteLabelResponseSchema,
} from '@feedback/schema';

export class LabelResponseDto extends createZodDto(getLabelResponseSchema) {}

export class LabelsResponseDto extends createZodDto(getLabelsResponseSchema) {}

export class LabelDeleteResponseDto extends createZodDto(
  deleteLabelResponseSchema,
) {}
