export const COLUMNS = {
  todo: { id: 'todo', title: 'Todo', color: '#6366f1' },
  doing: { id: 'doing', title: 'Doing', color: '#f59e0b' },
  done: { id: 'done', title: 'Done', color: '#10b981' },
};

export const COLUMN_ORDER = ['todo', 'doing', 'done'];

export const PRIORITIES = {
  low: { label: 'Low', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  high: { label: 'High', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
};

export const CREDENTIALS = {
  email: 'intern@demo.com',
  password: 'intern123',
};

export const STORAGE_KEYS = {
  AUTH: 'taskboard_auth',
  REMEMBER: 'taskboard_remember',
  BOARD: 'taskboard_board',
  ACTIVITY: 'taskboard_activity',
};
