/**
 * Application route configuration
 *
 * Route planning:
 * /                    - Public homepage (redirects to /login or /dashboard)
 * /login              - Login page
 * /dashboard          - Authenticated homepage (protected)
 * /profile            - User profile page (protected)
 * /pumps              - Pump device list (protected, prepared for Iteration 2)
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PUMPS: '/pumps',
} as const;
