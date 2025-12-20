import { createZodDto } from 'nestjs-zod';
import { addWorkspaceMemberSchema } from '@feedback/schema';

export class AddWorkspaceMemberDto extends createZodDto(
  addWorkspaceMemberSchema,
) {}
