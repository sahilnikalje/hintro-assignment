import { useState } from 'react';
import { useBoard } from '../contexts/BoardContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Search,
  Filter,
  ArrowUpDown,
  Activity,
  RotateCcw,
  LogOut,
  Layout,
  Plus,
} from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

export default function Header({ onAddTask }) {
  const {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    sortDirection,
    setSortDirection,
    showActivityLog,
    setShowActivityLog,
    resetBoard,
  } = useBoard();
  const { logout, user } = useAuth();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetBoard();
    setShowResetConfirm(false);
  };

  return (
    <>
      <header className="header" id="header">
        <div className="header-left">
          <div className="header-brand">
            <Layout size={24} className="header-logo" />
            <h1>TaskBoard</h1>
          </div>
        </div>

        <div className="header-controls">
          <div className="search-box" id="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="search-input"
            />
          </div>

          <div className="filter-group">
            <Filter size={16} />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              id="priority-filter"
              className="filter-select"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <button
            className="header-btn"
            onClick={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
            title={`Sort by due date (${sortDirection === 'asc' ? 'earliest first' : 'latest first'})`}
            id="sort-toggle"
          >
            <ArrowUpDown size={16} />
            <span className="btn-label">{sortDirection === 'asc' ? 'Earliest' : 'Latest'}</span>
          </button>

          <button
            className="header-btn add-task-btn"
            onClick={onAddTask}
            id="add-task-btn"
          >
            <Plus size={16} />
            <span className="btn-label">Add Task</span>
          </button>

          <button
            className={`header-btn ${showActivityLog ? 'active' : ''}`}
            onClick={() => setShowActivityLog(!showActivityLog)}
            title="Activity Log"
            id="activity-toggle"
          >
            <Activity size={16} />
            <span className="btn-label">Activity</span>
          </button>

          <button
            className="header-btn danger"
            onClick={() => setShowResetConfirm(true)}
            title="Reset Board"
            id="reset-btn"
          >
            <RotateCcw size={16} />
            <span className="btn-label">Reset</span>
          </button>

          <div className="header-user">
            <span className="user-email">{user?.email}</span>
            <button
              className="header-btn logout-btn"
              onClick={logout}
              title="Logout"
              id="logout-btn"
            >
              <LogOut size={16} />
              <span className="btn-label">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {showResetConfirm && (
        <ConfirmDialog
          title="Reset Board"
          message="Are you sure you want to reset the board? All tasks and activity history will be permanently deleted."
          confirmLabel="Reset Everything"
          onConfirm={handleReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </>
  );
}
