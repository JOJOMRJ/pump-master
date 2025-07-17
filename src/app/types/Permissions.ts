// 权限级别枚举
export const PERMISSIONS = {
  VIEW: 'view', // 查看权限
  EDIT: 'edit', // 编辑权限
  DELETE: 'delete', // 删除权限
  MANAGE: 'manage', // 管理权限
} as const;

// 权限类型
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
