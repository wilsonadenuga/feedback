import { z } from 'zod';
import { workspaceSchema } from './workspace.schema';
import { workspaceRoleSchema } from '../workspace-member/role.schema';

export const workspaceWithRoleSchema = workspaceSchema.extend({
  role: workspaceRoleSchema.optional(),
  project_count: z.number().optional(),
});

export type WorkspaceWithRole = z.infer<typeof workspaceWithRoleSchema>;
