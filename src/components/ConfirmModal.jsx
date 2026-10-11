import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  isLoading = false,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className={`modal-icon-badge ${isDanger ? 'danger' : 'primary'}`}>
            <AlertTriangle size={20} />
          </div>
          <button type="button" className="modal-close-btn" onClick={onCancel} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <h3 className="modal-title">{title}</h3>
          <p className="modal-desc">{message}</p>
        </div>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
