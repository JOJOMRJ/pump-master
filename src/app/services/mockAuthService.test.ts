import { login } from './mockAuthService';
import type { LoginCredentials } from '../types/Auth';

describe('MockAuthService', () => {
  describe('login', () => {
    it('should return success response for valid admin credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'admin@informag.com',
        password: 'admin123',
      };

      const response = await login(credentials);

      expect(response.success).toBe(true);
      expect(response.data?.user?.email).toBe('admin@informag.com');
      expect(response.data?.user?.role).toBe('admin');
      expect(response.data?.token).toBeDefined();
      expect(response.data?.expiresAt).toBeDefined();
    });

    it('should return error response for invalid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      const response = await login(credentials);

      expect(response.success).toBe(false);
      expect(response.error?.code).toBe('INVALID_CREDENTIALS');
      expect(response.error?.message).toBe('Invalid username or password');
    });

    it('should include network delay in response time', async () => {
      const startTime = Date.now();

      const credentials: LoginCredentials = {
        email: 'admin@informag.com',
        password: 'admin123',
      };

      await login(credentials);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should have at least 200ms delay
      expect(duration).toBeGreaterThanOrEqual(200);
    });
  });
});
