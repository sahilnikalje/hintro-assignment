import { createContext, useContext, useReducer, useCallback, useEffect, useMemo, useState } from 'react';
import { COLUMN_ORDER, STORAGE_KEYS } from '../utils/constants';
import { safeGetItem, safeSetItem } from '../utils/storage';

const BoardContext = createContext(null);

/* ── helpers ──────────────────────────────────────────────── */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function timestamp() {
  return new Date().toISOString();
}

function getDefaultBoard() {
  return { todo: [], doing: [], done: [] };
}

/* ── reducer ──────────────────────────────────────────────── */
function boardReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK': {
      const { columnId, task } = action.payload;
      const newTask = {
        id: generateId(),
        title: task.title.trim(),
        description: task.description?.trim() || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        tags: task.tags || [],
        createdAt: timestamp(),
      };
      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: [...state.columns[columnId], newTask],
        },
        activity: [
          { id: generateId(), action: 'created', taskTitle: newTask.title, timestamp: timestamp() },
          ...state.activity,
        ].slice(0, 50),
      };
    }

    case 'EDIT_TASK': {
      const { columnId, taskId, updates } = action.payload;
      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: state.columns[columnId].map((t) =>
            t.id === taskId ? { ...t, ...updates, title: updates.title?.trim() || t.title } : t
          ),
        },
        activity: [
          {
            id: generateId(),
            action: 'edited',
            taskTitle: updates.title?.trim() || state.columns[columnId].find((t) => t.id === taskId)?.title || 'Task',
            timestamp: timestamp(),
          },
          ...state.activity,
        ].slice(0, 50),
      };
    }

    case 'DELETE_TASK': {
      const { columnId, taskId, taskTitle } = action.payload;
      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: state.columns[columnId].filter((t) => t.id !== taskId),
        },
        activity: [
          { id: generateId(), action: 'deleted', taskTitle, timestamp: timestamp() },
          ...state.activity,
        ].slice(0, 50),
      };
    }

    case 'MOVE_TASK': {
      const { sourceCol, destCol, sourceIdx, destIdx } = action.payload;
      const sourceTasks = [...state.columns[sourceCol]];
      const [movedTask] = sourceTasks.splice(sourceIdx, 1);

      if (sourceCol === destCol) {
        sourceTasks.splice(destIdx, 0, movedTask);
        return {
          ...state,
          columns: { ...state.columns, [sourceCol]: sourceTasks },
        };
      }

      const destTasks = [...state.columns[destCol]];
      destTasks.splice(destIdx, 0, movedTask);

      return {
        ...state,
        columns: {
          ...state.columns,
          [sourceCol]: sourceTasks,
          [destCol]: destTasks,
        },
        activity: [
          {
            id: generateId(),
            action: 'moved',
            taskTitle: movedTask.title,
            from: sourceCol,
            to: destCol,
            timestamp: timestamp(),
          },
          ...state.activity,
        ].slice(0, 50),
      };
    }

    case 'RESET_BOARD':
      return {
        columns: getDefaultBoard(),
        activity: [
          { id: generateId(), action: 'reset', taskTitle: 'Board', timestamp: timestamp() },
        ],
      };

    default:
      return state;
  }
}

/* ── provider ─────────────────────────────────────────────── */
function loadInitialState() {
  const saved = safeGetItem(STORAGE_KEYS.BOARD, null);
  if (saved && saved.columns) {
    // Ensure all columns exist
    const columns = { ...getDefaultBoard(), ...saved.columns };
    return { columns, activity: Array.isArray(saved.activity) ? saved.activity : [] };
  }
  return { columns: getDefaultBoard(), activity: [] };
}

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(boardReducer, null, loadInitialState);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  const [showActivityLog, setShowActivityLog] = useState(false);

  // Persist state on every change
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.BOARD, state);
  }, [state]);

  const addTask = useCallback((columnId, task) => {
    dispatch({ type: 'ADD_TASK', payload: { columnId, task } });
  }, []);

  const editTask = useCallback((columnId, taskId, updates) => {
    dispatch({ type: 'EDIT_TASK', payload: { columnId, taskId, updates } });
  }, []);

  const deleteTask = useCallback((columnId, taskId, taskTitle) => {
    dispatch({ type: 'DELETE_TASK', payload: { columnId, taskId, taskTitle } });
  }, []);

  const moveTask = useCallback((sourceCol, destCol, sourceIdx, destIdx) => {
    dispatch({ type: 'MOVE_TASK', payload: { sourceCol, destCol, sourceIdx, destIdx } });
  }, []);

  const resetBoard = useCallback(() => {
    dispatch({ type: 'RESET_BOARD' });
  }, []);

  /* ── derive filtered / sorted columns ─────────────────── */
  const filteredColumns = useMemo(() => {
    const result = {};
    const query = searchQuery.toLowerCase();

    for (const colId of COLUMN_ORDER) {
      let tasks = state.columns[colId] || [];

      // Search filter
      if (query) {
        tasks = tasks.filter((t) => t.title.toLowerCase().includes(query));
      }

      // Priority filter
      if (priorityFilter !== 'all') {
        tasks = tasks.filter((t) => t.priority === priorityFilter);
      }

      // Sort by due date (empty dates last)
      tasks = [...tasks].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        const cmp = new Date(a.dueDate) - new Date(b.dueDate);
        return sortDirection === 'asc' ? cmp : -cmp;
      });

      result[colId] = tasks;
    }
    return result;
  }, [state.columns, searchQuery, priorityFilter, sortDirection]);

  const value = {
    columns: state.columns,
    filteredColumns,
    activity: state.activity,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    sortDirection,
    setSortDirection,
    showActivityLog,
    setShowActivityLog,
    addTask,
    editTask,
    deleteTask,
    moveTask,
    resetBoard,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard must be used within BoardProvider');
  return ctx;
}
