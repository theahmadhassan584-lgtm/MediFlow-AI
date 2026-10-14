import { useApp } from '../../context/AppContext.tsx';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        const icon =
          toast.type === 'success' ? (
            <CheckCircle2 size={18} className="toast-icon success" />
          ) : toast.type === 'warning' ? (
            <AlertTriangle size={18} className="toast-icon warning" />
          ) : toast.type === 'error' ? (
            <AlertCircle size={18} className="toast-icon error" />
          ) : (
            <Info size={18} className="toast-icon info" />
          );

        return (
          <div key={toast.id} className={`toast-card ${toast.type}`}>
            <div className="toast-content">
              {icon}
              <div className="toast-text">
                <span className="toast-title">{toast.title}</span>
                <p className="toast-message">{toast.message}</p>
              </div>
            </div>
            <button
              type="button"
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
