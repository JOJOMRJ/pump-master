import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePermissions } from './usePermissions';
import { useAuth } from '../contexts';
import { PERMISSIONS } from '../types/Permissions';

// Mock the useAuth hook
vi.mock('../contexts', () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

describe('usePermissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return hasPermission function', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        permissions: ['view', 'edit', 'delete', 'manage'],
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission).toBeDefined();
    expect(typeof result.current.hasPermission).toBe('function');
  });

  it('should return true when user has the required permission', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        permissions: ['view', 'edit', 'delete', 'manage'],
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission(PERMISSIONS.VIEW)).toBe(true);
    expect(result.current.hasPermission(PERMISSIONS.EDIT)).toBe(true);
    expect(result.current.hasPermission(PERMISSIONS.DELETE)).toBe(true);
    expect(result.current.hasPermission(PERMISSIONS.MANAGE)).toBe(true);
  });

  it('should return false when user does not have the required permission', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'viewer',
        permissions: ['view'],
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission(PERMISSIONS.VIEW)).toBe(true);
    expect(result.current.hasPermission(PERMISSIONS.EDIT)).toBe(false);
    expect(result.current.hasPermission(PERMISSIONS.DELETE)).toBe(false);
    expect(result.current.hasPermission(PERMISSIONS.MANAGE)).toBe(false);
  });

  it('should return false when user is null', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission(PERMISSIONS.VIEW)).toBe(false);
    expect(result.current.hasPermission(PERMISSIONS.EDIT)).toBe(false);
    expect(result.current.hasPermission(PERMISSIONS.DELETE)).toBe(false);
    expect(result.current.hasPermission(PERMISSIONS.MANAGE)).toBe(false);
  });

  it('should return false when user permissions is undefined', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        permissions: undefined,
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission(PERMISSIONS.VIEW)).toBe(false);
    expect(result.current.hasPermission(PERMISSIONS.EDIT)).toBe(false);
  });

  it('should return false when user permissions is null', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        permissions: null,
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission(PERMISSIONS.VIEW)).toBe(false);
    expect(result.current.hasPermission(PERMISSIONS.EDIT)).toBe(false);
  });

  it('should return false when user permissions is empty array', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        permissions: [],
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission(PERMISSIONS.VIEW)).toBe(false);
    expect(result.current.hasPermission(PERMISSIONS.EDIT)).toBe(false);
  });

  it('should handle operator permissions correctly', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        email: 'operator@test.com',
        name: 'Operator User',
        role: 'operator',
        permissions: ['view', 'edit'],
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission(PERMISSIONS.VIEW)).toBe(true);
    expect(result.current.hasPermission(PERMISSIONS.EDIT)).toBe(true);
    expect(result.current.hasPermission(PERMISSIONS.DELETE)).toBe(false);
    expect(result.current.hasPermission(PERMISSIONS.MANAGE)).toBe(false);
  });

  it('should handle viewer permissions correctly', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        email: 'viewer@test.com',
        name: 'Viewer User',
        role: 'viewer',
        permissions: ['view'],
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission(PERMISSIONS.VIEW)).toBe(true);
    expect(result.current.hasPermission(PERMISSIONS.EDIT)).toBe(false);
    expect(result.current.hasPermission(PERMISSIONS.DELETE)).toBe(false);
    expect(result.current.hasPermission(PERMISSIONS.MANAGE)).toBe(false);
  });

  it('should memoize hasPermission function', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        permissions: ['view', 'edit'],
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result, rerender } = renderHook(() => usePermissions());
    const firstHasPermission = result.current.hasPermission;

    rerender();
    const secondHasPermission = result.current.hasPermission;

    expect(firstHasPermission).toBe(secondHasPermission);
  });
});
