/**
 * 应用路由配置
 *
 * 路由规划：
 * /                    - 公共主页 (重定向到/login或/dashboard)
 * /login              - 登录页面
 * /dashboard          - 认证后的主页面 (受保护)
 * /profile            - 用户资料页面 (受保护)
 * /pumps              - 泵设备列表 (受保护，为Iteration 2准备)
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PUMPS: '/pumps',
} as const;
