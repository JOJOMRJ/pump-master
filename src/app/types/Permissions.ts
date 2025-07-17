// Permission level enumeration
export const PERMISSIONS = {
  VIEW: 'view', // View permission
  EDIT: 'edit', // Edit permission
  DELETE: 'delete', // Delete permission
  MANAGE: 'manage', // Manage permission
} as const;

// Permission type
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
