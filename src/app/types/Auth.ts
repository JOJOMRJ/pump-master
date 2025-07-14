import type { User } from './User';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token?: string;
    refreshToken?: string;
    expiresAt?: string;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp?: string;
  requestId?: string;
}

export interface MockAuthServiceConfig {
  networkDelay: {
    min: number;
    max: number;
  };
  errorSimulation: {
    enabled: boolean;
    rate: number; // 0-1 probability
  };
}
