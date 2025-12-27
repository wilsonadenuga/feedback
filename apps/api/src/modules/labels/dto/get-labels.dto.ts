import { createZodDto } from 'nestjs-zod';
import {
  getLabelsQuerySchema,
  getLabelsResponseSchema,
} from '@feedback/schema';

export class GetLabelsQueryDto extends createZodDto(getLabelsQuerySchema) {}

export class GetLabelsResponseDto extends createZodDto(
  getLabelsResponseSchema,
) {}
