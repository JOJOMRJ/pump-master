// Token storage key constants
const TOKEN_KEY = 'pump_master_auth_token';
const REFRESH_TOKEN_KEY = 'pump_master_refresh_token';

/**
 * Token storage utility - following KISS principle
 * Provides basic localStorage operations only, no business logic
 */
export const tokenStorage = {
  // Get access token
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  // Set access token
  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Fail silently, localStorage may not be available in some environments
    }
  },

  // Remove access token
  removeToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Fail silently
    }
  },

  // Get refresh token
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  // Set refresh token
  setRefreshToken(refreshToken: string): void {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch {
      // Fail silently
    }
  },

  // Remove refresh token
  removeRefreshToken(): void {
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // Fail silently
    }
  },

  // Clear all authentication related data
  clearAll(): void {
    this.removeToken();
    this.removeRefreshToken();
  },
};
