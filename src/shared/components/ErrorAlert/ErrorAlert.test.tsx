import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorAlert } from './ErrorAlert';

describe('ErrorAlert', () => {
  it('should render error message when message is provided', () => {
    const errorMessage = 'Test error message';

    render(<ErrorAlert message={errorMessage} />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(errorMessage);
    expect(alert).toHaveClass('alert', 'alert-danger');
  });

  it('should not render when message is empty string', () => {
    render(<ErrorAlert message="" />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should not render when message is undefined', () => {
    render(<ErrorAlert />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should apply correct Bootstrap classes', () => {
    render(<ErrorAlert message="Error" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert', 'alert-danger');
  });

  it('should handle long error messages', () => {
    const longMessage =
      'This is a very long error message that might wrap to multiple lines and should still be displayed correctly';

    render(<ErrorAlert message={longMessage} />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(longMessage);
  });

  it('should handle error messages with special characters', () => {
    const messageWithSpecialChars = 'Error: Invalid input! @#$%^&*()';

    render(<ErrorAlert message={messageWithSpecialChars} />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(messageWithSpecialChars);
  });
});
