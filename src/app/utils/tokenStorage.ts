// Token存储的key常量
const TOKEN_KEY = 'pump_master_auth_token';
const REFRESH_TOKEN_KEY = 'pump_master_refresh_token';

/**
 * Token存储工具 - 遵循KISS原则
 * 只提供基础的localStorage操作，不包含业务逻辑
 */
export const tokenStorage = {
  // 获取访问token
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  // 设置访问token
  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // 静默失败，在某些环境中localStorage可能不可用
    }
  },

  // 移除访问token
  removeToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // 静默失败
    }
  },

  // 获取refresh token
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  // 设置refresh token
  setRefreshToken(refreshToken: string): void {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch {
      // 静默失败
    }
  },

  // 移除refresh token
  removeRefreshToken(): void {
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // 静默失败
    }
  },

  // 清除所有认证相关数据
  clearAll(): void {
    this.removeToken();
    this.removeRefreshToken();
  },
};
