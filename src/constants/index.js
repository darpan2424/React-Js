export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const PROJECT_STATUSES = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ON_HOLD: 'onHold',
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUSES.ACTIVE]: 'Active',
  [PROJECT_STATUSES.COMPLETED]: 'Completed',
  [PROJECT_STATUSES.ON_HOLD]: 'On Hold',
};

export const DRAWER_WIDTH = 240;

export const CURRENCY = 'USD';

export const DATE_FORMAT = 'YYYY-MM-DD';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
  FORBIDDEN: 'Access forbidden. You do not have permission.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful.',
  REGISTER: 'Registration successful. Please login.',
  LOGOUT: 'Logout successful.',
  CREATE: 'Created successfully.',
  UPDATE: 'Updated successfully.',
  DELETE: 'Deleted successfully.',
  PASSWORD_RESET: 'Password reset instructions sent to your email.',
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  ESTIMATIONS: '/estimations',
}; 