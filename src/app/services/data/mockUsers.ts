import type { User } from '../../types';

export interface MockUserWithPassword extends User {
  password: string;
}

export const MOCK_USERS: MockUserWithPassword[] = [
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
