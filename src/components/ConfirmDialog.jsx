import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="confirm-icon">
          <AlertTriangle size={32} />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel} id="confirm-cancel">
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} id="confirm-ok">
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
