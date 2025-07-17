import type { LoginCredentials, AuthResponse } from '../types/Auth';
import type { User } from '../types/User';
import {
  validateUserCredentials,
  type MockUserWithPassword,
} from './data/mockUsers';

// Simple network delay simulation
const simulateDelay = (): Promise<void> => {
  const delay = Math.random() * 800 + 200; // 200-1000ms
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Generate simple JWT token
const generateToken = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      permissions: user.permissions, // Add permissions field
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours expiration
    })
  );
  return `${header}.${payload}.mock-signature`;
};

// Exclude password from user object
const excludePassword = (userWithPassword: MockUserWithPassword): User => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...user } = userWithPassword;
  return user;
};

// Login function
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    // Simulate network delay
    await simulateDelay();

    // Validate user credentials
    const userWithPassword = validateUserCredentials(
      credentials.email,
      credentials.password
    );

    if (!userWithPassword) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid username or password',
        },
      };
    }

    // Login successful
    const user = excludePassword(userWithPassword);
    return {
      success: true,
      data: {
        user,
        token: generateToken(user),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    };
  } catch {
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    };
  }
};

// Default export containing all methods (backward compatibility)
export const mockAuthService = {
  login,
};
