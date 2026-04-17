import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PRIORITIES } from '../utils/constants';

const INITIAL_FORM = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  tags: '',
};

export default function TaskModal({ task, onSave, onClose }) {
  const isEdit = !!task;
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        tags: Array.isArray(task.tags) ? task.tags.join(', ') : '',
      });
    }
  }, [task]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (form.title.trim().length > 100) errs.title = 'Title must be under 100 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      title: form.title,
      description: form.description,
      priority: form.priority,
      dueDate: form.dueDate,
      tags,
    });
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: '' }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Task' : 'Create Task'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close" id="modal-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form" id="task-form">
          <div className="form-group">
            <label htmlFor="task-title">
              Title <span className="required">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={form.title}
              onChange={handleChange('title')}
              placeholder="Enter task title"
              autoFocus
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Enter task description (optional)"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={handleChange('priority')}
              >
                {Object.entries(PRIORITIES).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-due-date">Due Date</label>
              <input
                id="task-due-date"
                type="date"
                value={form.dueDate}
                onChange={handleChange('dueDate')}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-tags">Tags</label>
            <input
              id="task-tags"
              type="text"
              value={form.tags}
              onChange={handleChange('tags')}
              placeholder="e.g. frontend, urgent, bug (comma-separated)"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" id="task-submit">
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
