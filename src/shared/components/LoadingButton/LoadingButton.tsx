import React from 'react';

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';
  size?: 'sm' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText = 'Loading...',
  variant = 'primary',
  size,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size ? `btn-${size}` : '';
  const fullWidthClass = fullWidth ? 'w-100' : '';

  const combinedClassName = [
    baseClass,
    variantClass,
    sizeClass,
    fullWidthClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...props}
      className={combinedClassName}
      disabled={isLoading || disabled}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};

export default LoadingButton;
