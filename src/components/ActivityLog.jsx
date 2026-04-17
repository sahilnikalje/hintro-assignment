import { useBoard } from '../contexts/BoardContext';
import { COLUMNS } from '../utils/constants';
import {
  X,
  PlusCircle,
  Edit3,
  Trash2,
  ArrowRightLeft,
  RotateCcw,
  Clock,
} from 'lucide-react';

const ACTION_ICONS = {
  created: PlusCircle,
  edited: Edit3,
  deleted: Trash2,
  moved: ArrowRightLeft,
  reset: RotateCcw,
};

const ACTION_COLORS = {
  created: '#10b981',
  edited: '#6366f1',
  deleted: '#ef4444',
  moved: '#f59e0b',
  reset: '#8b5cf6',
};

export default function ActivityLog() {
  const { activity, showActivityLog, setShowActivityLog } = useBoard();

  if (!showActivityLog) return null;

  const formatTime = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getActionText = (entry) => {
    switch (entry.action) {
      case 'created':
        return `created "${entry.taskTitle}"`;
      case 'edited':
        return `edited "${entry.taskTitle}"`;
      case 'deleted':
        return `deleted "${entry.taskTitle}"`;
      case 'moved':
        return `moved "${entry.taskTitle}" from ${COLUMNS[entry.from]?.title || entry.from} to ${COLUMNS[entry.to]?.title || entry.to}`;
      case 'reset':
        return 'Board was reset';
      default:
        return entry.action;
    }
  };

  return (
    <div className="activity-overlay" onClick={() => setShowActivityLog(false)}>
      <div className="activity-panel" onClick={(e) => e.stopPropagation()}>
        <div className="activity-header">
          <h2>Activity Log</h2>
          <button
            className="modal-close"
            onClick={() => setShowActivityLog(false)}
            aria-label="Close activity log"
          >
            <X size={20} />
          </button>
        </div>

        <div className="activity-list">
          {activity.length === 0 ? (
            <div className="activity-empty">
              <Clock size={32} />
              <p>No activity yet</p>
            </div>
          ) : (
            activity.map((entry) => {
              const Icon = ACTION_ICONS[entry.action] || Clock;
              const color = ACTION_COLORS[entry.action] || '#94a3b8';
              return (
                <div key={entry.id} className="activity-item">
                  <div className="activity-icon" style={{ color, background: `${color}20` }}>
                    <Icon size={14} />
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">{getActionText(entry)}</p>
                    <span className="activity-time">{formatTime(entry.timestamp)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
