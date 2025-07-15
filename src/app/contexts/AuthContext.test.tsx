import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { mockAuthService } from '../services/mockAuthService';
import type { User } from '../types';

// Mock child component to test the context
const TestConsumer = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="isAuthenticated">{String(isAuthenticated)}</div>
      <div data-testid="user">{JSON.stringify(user)}</div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

// Mock successful login response
const mockSuccessResponse = {
  success: true,
  data: {
    token: 'fake-token',
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin',
    } as User,
  },
};

// Mock failed login response
const mockFailResponse = {
  success: false,
  error: 'Invalid credentials',
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Spy on mockAuthService.login
    vi.spyOn(mockAuthService, 'login');
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('useAuth should throw error when used outside of AuthProvider', () => {
    // Suppress console.error output for this test
    const err = console.error;
    console.error = vi.fn();
    expect(() => render(<TestConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );
    console.error = err;
  });

  it('should provide default auth values', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('should handle successful login', async () => {
    vi.mocked(mockAuthService.login).mockResolvedValue(mockSuccessResponse);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    expect(screen.getByTestId('user').textContent).toBe(
      JSON.stringify(mockSuccessResponse.data.user)
    );
    expect(localStorage.getItem('token')).toBe('fake-token');
  });

  it('should handle failed login', async () => {
    vi.mocked(mockAuthService.login).mockResolvedValue(mockFailResponse);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should handle logout', async () => {
    vi.mocked(mockAuthService.login).mockResolvedValue(mockSuccessResponse);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // Login first
    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');

    // Then logout
    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should handle login failure on error', async () => {
    const loginError = new Error('Network error');
    vi.mocked(mockAuthService.login).mockRejectedValue(loginError);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(localStorage.getItem('token')).toBeNull();
  });

  describe('Session Restoration', () => {
    const generateToken = (payload: object, expired = false) => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const exp = Math.floor(Date.now() / 1000) + (expired ? -3600 : 3600);
      const newPayload = btoa(JSON.stringify({ ...payload, exp }));
      return `${header}.${newPayload}.signature`;
    };

    it('should restore session from valid token', () => {
      const user = {
        userId: '1',
        name: 'Test',
        email: 'test@test.com',
        role: 'admin',
      };
      const token = generateToken(user);
      localStorage.setItem('token', token);

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
      const restoredUser = JSON.parse(
        screen.getByTestId('user').textContent || ''
      );
      expect(restoredUser.email).toBe(user.email);
    });

    it('should clear expired token', () => {
      const user = {
        userId: '1',
        name: 'Test',
        email: 'test@test.com',
        role: 'admin',
      };
      const token = generateToken(user, true);
      localStorage.setItem('token', token);

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
      expect(screen.getByTestId('user').textContent).toBe('null');
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should clear invalid token', () => {
      localStorage.setItem('token', 'invalid-token');

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
      expect(screen.getByTestId('user').textContent).toBe('null');
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should restore session and derive name from email if name is missing', () => {
      const user = { userId: '1', email: 'test@test.com', role: 'admin' };
      const token = generateToken(user);
      localStorage.setItem('token', token);

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
      const restoredUser = JSON.parse(
        screen.getByTestId('user').textContent || ''
      );
      expect(restoredUser.name).toBe('test');
    });

    it('should clear token if payload is not valid JSON', () => {
      const invalidPayloadToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.aW52YWxpZC1qc29u.c2lnbmF0dXJl';
      localStorage.setItem('token', invalidPayloadToken);

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
      expect(screen.getByTestId('user').textContent).toBe('null');
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should clear token if payload is missing required fields', () => {
      // Token has a valid expiration but is missing the 'email' field.
      const incompletePayload = { userId: '1', role: 'admin' };
      const token = generateToken(incompletePayload);
      localStorage.setItem('token', token);

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      // isTokenExpired() passes, but parseUserFromToken() fails and returns null.
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
      expect(screen.getByTestId('user').textContent).toBe('null');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
