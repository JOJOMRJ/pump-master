import React from 'react';

interface ErrorAlertProps {
  message?: string;
  variant?: 'danger' | 'warning' | 'info';
  className?: string;
  onClose?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  variant = 'danger',
  className = '',
  onClose,
}) => {
  if (!message) return null;

  const alertClass = `alert alert-${variant} ${className}`;

  return (
    <div className={alertClass} role="alert">
      {message}
      {onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
};

export default ErrorAlert;
