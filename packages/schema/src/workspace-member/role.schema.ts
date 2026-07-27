import { z } from 'zod';

export const WORKSPACE_ROLES = {
  /**
   * Full control over the workspace, including billing, member management,
   * and the ability to delete the workspace or transfer ownership.
   */
  OWNER: 'OWNER',
  /**
   * Can manage workspace members and board settings, with full access to
   * feedback and roadmaps. Cannot delete the workspace or change ownership.
   */
  ADMIN: 'ADMIN',
  /**
   * Can create and manage feedback, roadmap items, and labels, and respond
   * to customers. Cannot manage members or workspace settings.
   */
  MEMBER: 'MEMBER',
  /**
   * Read-only access to feedback and roadmaps. Cannot edit, create, or
   * respond to anything. Ideal for stakeholders and observers.
   */
  VIEWER: 'VIEWER',
} as const;

export const workspaceRoleSchema = z.enum(WORKSPACE_ROLES);

export type WorkspaceRole = z.infer<typeof workspaceRoleSchema>;

export const isValidWorkspaceRole = (role: string): role is WorkspaceRole => {
  return Object.values(WORKSPACE_ROLES).includes(role as WorkspaceRole);
};
