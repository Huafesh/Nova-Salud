import { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, X, Info } from 'lucide-react';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
};

const COLORS = {
  success: 'var(--success-color)',
  error: 'var(--danger-color)',
  warning: '#f59e0b',
  info: 'var(--accent-color)'
};

/**
 * Toast notification component. Auto-dismiss after duration ms.
 * Props: message, type ('success'|'error'|'warning'|'info'), onClose, duration
 */
const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const Icon = ICONS[type] || Info;
  const color = COLORS[type] || 'var(--accent-color)';

  return (
    <div style={{
      position: 'fixed',
      top: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      minWidth: '300px',
      maxWidth: '420px',
      padding: '1rem 1.25rem',
      backgroundColor: 'var(--bg-secondary)',
      borderLeft: `4px solid ${color}`,
      border: `1px solid var(--border-color)`,
      borderLeftColor: color,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      animation: 'toastIn 0.25s ease',
    }}>
      <Icon size={20} style={{ color, flexShrink: 0, marginTop: '1px' }} />
      <p style={{ flex: 1, fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
        {message}
      </p>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
          padding: 0,
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
