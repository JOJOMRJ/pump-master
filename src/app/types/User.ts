export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  tenantId: string;
  createdAt: string;
  lastLoginAt?: string;
}
