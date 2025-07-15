import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tokenStorage } from './tokenStorage';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('tokenStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const mockToken = 'test-token';
      localStorageMock.getItem.mockReturnValue(mockToken);

      const result = tokenStorage.getToken();

      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'pump_master_auth_token'
      );
      expect(result).toBe(mockToken);
    });

    it('should return null when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = tokenStorage.getToken();

      expect(result).toBeNull();
    });

    it('should return null when localStorage throws error', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      const result = tokenStorage.getToken();

      expect(result).toBeNull();
    });
  });

  describe('setToken', () => {
    it('should store token in localStorage', () => {
      const testToken = 'test-token';

      tokenStorage.setToken(testToken);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pump_master_auth_token',
        testToken
      );
    });

    it('should handle localStorage error silently', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      expect(() => tokenStorage.setToken('test-token')).not.toThrow();
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      tokenStorage.removeToken();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'pump_master_auth_token'
      );
    });

    it('should handle localStorage error silently', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      expect(() => tokenStorage.removeToken()).not.toThrow();
      expect(localStorageMock.removeItem).toHaveBeenCalled();
    });
  });

  describe('getRefreshToken', () => {
    it('should return refresh token from localStorage', () => {
      const mockRefreshToken = 'refresh-token';
      localStorageMock.getItem.mockReturnValue(mockRefreshToken);

      const result = tokenStorage.getRefreshToken();

      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'pump_master_refresh_token'
      );
      expect(result).toBe(mockRefreshToken);
    });

    it('should return null when no refresh token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = tokenStorage.getRefreshToken();

      expect(result).toBeNull();
    });

    it('should return null when localStorage throws error', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      const result = tokenStorage.getRefreshToken();

      expect(result).toBeNull();
    });
  });

  describe('setRefreshToken', () => {
    it('should store refresh token in localStorage', () => {
      const testRefreshToken = 'refresh-token';

      tokenStorage.setRefreshToken(testRefreshToken);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pump_master_refresh_token',
        testRefreshToken
      );
    });

    it('should handle localStorage error silently', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      expect(() => tokenStorage.setRefreshToken('refresh-token')).not.toThrow();
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe('removeRefreshToken', () => {
    it('should remove refresh token from localStorage', () => {
      tokenStorage.removeRefreshToken();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'pump_master_refresh_token'
      );
    });

    it('should handle localStorage error silently', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      expect(() => tokenStorage.removeRefreshToken()).not.toThrow();
      expect(localStorageMock.removeItem).toHaveBeenCalled();
    });
  });

  describe('clearAll', () => {
    it('should remove both tokens from localStorage', () => {
      tokenStorage.clearAll();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'pump_master_auth_token'
      );
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'pump_master_refresh_token'
      );
      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(2);
    });

    it('should handle localStorage errors silently', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      expect(() => tokenStorage.clearAll()).not.toThrow();
      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(2);
    });
  });
});
