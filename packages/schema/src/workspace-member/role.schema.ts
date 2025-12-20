import { z } from 'zod';

export const WORKSPACE_ROLES = {
  ADMIN: 'admin',
} as const;

export type WorkspaceRole =
  (typeof WORKSPACE_ROLES)[keyof typeof WORKSPACE_ROLES];

export const workspaceRoleSchema = z.enum(['admin']);

export const isValidWorkspaceRole = (role: string): role is WorkspaceRole => {
  return Object.values(WORKSPACE_ROLES).includes(role as WorkspaceRole);
};
