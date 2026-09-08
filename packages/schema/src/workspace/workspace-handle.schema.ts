import { z } from 'zod';

export const RESERVED_WORKSPACE_HANDLES = [
  'abuse',
  'admin',
  'administrator',
  'api',
  'assets',
  'auth',
  'billing',
  'blog',
  'dashboard',
  'docs',
  'help',
  'hostmaster',
  'login',
  'logout',
  'new',
  'noc',
  'onboarding',
  'postmaster',
  'pricing',
  'privacy',
  'public',
  'register',
  'root',
  'security',
  'settings',
  'signup',
  'static',
  'status',
  'support',
  'terms',
  'webmaster',
  'well-known',
  'www',
] as const;

export const workspaceHandleSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Workspace address must be at least 3 characters')
  .max(40, 'Workspace address must not exceed 40 characters')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Workspace address may only contain lowercase letters, numbers and hyphens, and cannot start or end with a hyphen',
  )
  .refine(
    (handle) =>
      !(RESERVED_WORKSPACE_HANDLES as readonly string[]).includes(handle),
    'That workspace address is reserved',
  );

export type WorkspaceHandle = z.infer<typeof workspaceHandleSchema>;
