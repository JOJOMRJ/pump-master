import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingProps {
  height?: string;
  size?: 'sm' | undefined;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  height = '200px',
  size,
  variant = 'primary',
  message = 'Loading...',
}) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height }}
    >
      <Spinner animation="border" size={size} variant={variant} role="status">
        <span className="visually-hidden">{message}</span>
      </Spinner>
    </div>
  );
};

export default Loading;
