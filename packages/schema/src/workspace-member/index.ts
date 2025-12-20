import { z } from 'zod';
import { uuidSchema } from '../common';

export * from './add-workspace-member.schema';
export const workspaceMemberSchema = z.object({
    id: uuidSchema,
    workspace_id: uuidSchema,
    user_id: uuidSchema,
    role: z.string(),
    display_name: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type WorkspaceMember = z.infer<typeof workspaceMemberSchema>;
