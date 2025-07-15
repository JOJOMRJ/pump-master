import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import type { ButtonProps } from 'react-bootstrap';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  ...props
}) => {
  return (
    <Button {...props} disabled={isLoading || disabled}>
      {isLoading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
      )}
      {isLoading ? loadingText : children}
    </Button>
  );
};

export default LoadingButton;
