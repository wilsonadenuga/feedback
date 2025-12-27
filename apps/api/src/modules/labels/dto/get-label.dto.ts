import { createZodDto } from 'nestjs-zod';
import { getLabelResponseSchema } from '@feedback/schema';

export class GetLabelResponseDto extends createZodDto(getLabelResponseSchema) {}
