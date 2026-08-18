import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ 
  isOpen, 
  title = 'Are you sure?', 
  message = 'This action cannot be undone.', 
  onConfirm, 
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel'
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card confirm-card">
        <AlertTriangle className="confirm-icon" size={48} />
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-text">{message}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
