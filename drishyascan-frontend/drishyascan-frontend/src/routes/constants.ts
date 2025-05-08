export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  WEBSITES: '/websites',
  SCANS: '/scans',
  ISSUES: '/issues',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  
  // Special routes
  ROOT: '/',
  NOT_FOUND: '*'
} as const;

export const ROUTE_TITLES = {
  [ROUTES.LOGIN]: 'Sign In',
  [ROUTES.REGISTER]: 'Create Account',
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.PROJECTS]: 'Projects',
  [ROUTES.WEBSITES]: 'Websites',
  [ROUTES.SCANS]: 'Accessibility Scans',
  [ROUTES.ISSUES]: 'Issues',
  [ROUTES.REPORTS]: 'Reports',
  [ROUTES.SETTINGS]: 'Settings',
  [ROUTES.NOT_FOUND]: 'Page Not Found'
} as const; 