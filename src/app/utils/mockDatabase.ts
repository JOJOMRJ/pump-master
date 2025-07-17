import type { User } from '../types';

// Mock user data (includes passwords for mock validation only)
export const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'user-admin-001',
    email: 'admin@informag.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    permissions: ['view', 'edit', 'delete', 'manage'],
  },
  {
    id: 'user-operator-001',
    email: 'operator@informag.com',
    password: 'operator123',
    name: 'Operator User',
    role: 'operator',
    permissions: ['view', 'edit'],
  },
  {
    id: 'user-viewer-001',
    email: 'viewer@informag.com',
    password: 'viewer123',
    name: 'Viewer User',
    role: 'viewer',
    permissions: ['view'],
  },
];
