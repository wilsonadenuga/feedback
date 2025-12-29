import { z } from 'zod';

export const WORKSPACE_ROLES = {
  /**
   * Full control over the workspace, including billing, member management,
   * and the ability to delete the workspace or transfer ownership.
   */
  OWNER: 'owner',
  /**
   * Can manage workspace members, create and delete projects, and has full
   * access to feedback, roadmaps, and settings. Cannot delete the workspace
   * or change ownership.
   */
  ADMIN: 'admin',
  /**
   * Can create and manage feedback, roadmap items, categories, and respond
   * to customers. Cannot manage members or projects.
   */
  MEMBER: 'member',
  /**
   * Read-only access to feedback and roadmaps. Cannot edit, create, or
   * respond to anything. Ideal for stakeholders and observers.
   */
  VIEWER: 'viewer',
} as const;

export type WorkspaceRole =
  (typeof WORKSPACE_ROLES)[keyof typeof WORKSPACE_ROLES];

export const workspaceRoleSchema = z.enum(['admin']);

export const isValidWorkspaceRole = (role: string): role is WorkspaceRole => {
  return Object.values(WORKSPACE_ROLES).includes(role as WorkspaceRole);
};
