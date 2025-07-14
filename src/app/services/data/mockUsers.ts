import type { User } from '../../types';

export interface MockUserWithPassword extends User {
  password: string;
  tenantId: string;
  createdAt: string;
  lastLoginAt?: string;
}

export const MOCK_USERS: MockUserWithPassword[] = [
  {
    id: 'user-admin-001',
    email: 'admin@informag.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    tenantId: 'tenant-informag',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'user-operator-001',
    email: 'operator@informag.com',
    password: 'operator123',
    name: 'Operator User',
    role: 'operator',
    tenantId: 'tenant-informag',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-14T14:20:00Z',
  },
  {
    id: 'user-viewer-001',
    email: 'viewer@informag.com',
    password: 'viewer123',
    name: 'Viewer User',
    role: 'viewer',
    tenantId: 'tenant-informag',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const findUserByEmail = (
  email: string
): MockUserWithPassword | undefined => {
  return MOCK_USERS.find(
    user => user.email.toLowerCase() === email.toLowerCase()
  );
};

export const validateUserCredentials = (
  email: string,
  password: string
): MockUserWithPassword | null => {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};
