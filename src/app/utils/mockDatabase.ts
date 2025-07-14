import type { User } from '../types';

// Mock用户数据（包含密码，仅用于Mock验证）
export const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'user-admin-001',
    email: 'admin@informag.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    tenantId: 'tenant-informag',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-operator-001',
    email: 'operator@informag.com',
    password: 'operator123',
    name: 'Operator User',
    role: 'operator',
    tenantId: 'tenant-informag',
    createdAt: '2024-01-01T00:00:00Z',
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
