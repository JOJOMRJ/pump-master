import { useCallback } from 'react';
import { useAuth } from '../contexts';
import type { Permission } from '../types/Permissions';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user?.permissions) return false;
      return user.permissions.includes(permission);
    },
    [user]
  );

  return { hasPermission };
};
