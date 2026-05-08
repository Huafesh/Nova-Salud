import { AlertTriangle } from 'lucide-react';

/**
 * Cuadro de confirmación corporativo. Reemplaza window.confirm().
 * Props: message, onConfirm, onCancel, confirmLabel, cancelLabel, type ('danger'|'warning')
 */
const ConfirmDialog = ({
  message,
  detail,
  onConfirm,
  onCancel,
  confirmLabel = 'CONFIRMAR',
  cancelLabel = 'CANCELAR',
  type = 'danger'
}) => {
  const accentColor = type === 'danger' ? 'var(--danger-color)' : '#f59e0b';

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9998,
      animation: 'fadeIn 0.15s ease'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'var(--bg-secondary)',
        border: `1px solid var(--border-color)`,
        borderTop: `4px solid ${accentColor}`,
        padding: '2rem',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <AlertTriangle size={22} style={{ color: accentColor, flexShrink: 0 }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>
            {type === 'danger' ? 'ACCIÓN DESTRUCTIVA' : 'CONFIRMACIÓN REQUERIDA'}
          </h3>
        </div>

        {/* Message */}
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: detail ? '0.5rem' : '1.75rem', lineHeight: 1.6 }}>
          {message}
        </p>
        {detail && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            {detail}
          </p>
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border-color)', marginBottom: '1.25rem' }} />

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.6rem 1.5rem',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              cursor: 'pointer'
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.6rem 1.5rem',
              backgroundColor: accentColor,
              color: 'white',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              cursor: 'pointer'
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
