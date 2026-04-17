import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { PRIORITIES } from '../utils/constants';
import { Calendar, Edit3, Trash2, GripVertical } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

export default function TaskCard({ task, index, columnId, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const priority = PRIORITIES[task.priority] || PRIORITIES.medium;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date(new Date().toDateString());
  };

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            id={`task-${task.id}`}
          >
            <div className="task-card-header">
              <div className="drag-handle" {...provided.dragHandleProps}>
                <GripVertical size={14} />
              </div>
              <span
                className="priority-badge"
                style={{ color: priority.color, background: priority.bg }}
              >
                {priority.label}
              </span>
              <div className="task-actions">
                <button
                  className="task-action-btn"
                  onClick={() => onEdit(task, columnId)}
                  title="Edit"
                  aria-label="Edit task"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  className="task-action-btn delete"
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Delete"
                  aria-label="Delete task"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <h3 className="task-title">{task.title}</h3>

            {task.description && (
              <p className="task-description">{task.description}</p>
            )}

            <div className="task-meta">
              {task.dueDate && (
                <span className={`task-due ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                  <Calendar size={12} />
                  {formatDate(task.dueDate)}
                </span>
              )}
              {task.tags && task.tags.length > 0 && (
                <div className="task-tags">
                  {task.tags.map((tag, i) => (
                    <span key={i} className="task-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Task"
          message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => {
            onDelete(columnId, task.id, task.title);
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}
