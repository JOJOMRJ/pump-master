import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../../contexts/AuthContext';
import { LoginForm } from './LoginForm';

const LoginFormWrapper = ({
  isLoading = false,
  error = '',
  onSubmit = vi.fn(),
}) => (
  <BrowserRouter>
    <AuthProvider>
      <LoginForm isLoading={isLoading} error={error} onSubmit={onSubmit} />
    </AuthProvider>
  </BrowserRouter>
);

describe('LoginForm', () => {
  it('renders form elements', () => {
    render(<LoginFormWrapper />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('renders form in proper structure', () => {
    render(<LoginFormWrapper />);

    const form = screen
      .getByRole('button', { name: 'Sign In' })
      .closest('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('novalidate');
  });

  it('has email input with correct type', () => {
    render(<LoginFormWrapper />);

    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('has password input with correct type', () => {
    render(<LoginFormWrapper />);

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('allows user to enter email and password', () => {
    render(<LoginFormWrapper />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('submits form with correct data', async () => {
    const onSubmit = vi.fn();
    render(<LoginFormWrapper onSubmit={onSubmit} />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(submitButton);

    // Should call onSubmit with correct data
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          username: 'admin@test.com',
          password: 'admin123',
        },
        expect.anything()
      );
    });
  });

  it('shows validation errors for empty fields', async () => {
    render(<LoginFormWrapper />);

    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    render(<LoginFormWrapper />);

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    render(<LoginFormWrapper />);

    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Password must be at least 6 characters')
      ).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    render(<LoginFormWrapper isLoading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Loading...' })).toBeDisabled();
  });

  it('shows error message for invalid credentials', () => {
    render(<LoginFormWrapper error="Invalid credentials" />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('disables submit button when loading', async () => {
    render(<LoginFormWrapper isLoading={true} />);

    const loadingButton = screen.getByRole('button', { name: 'Loading...' });
    expect(loadingButton).toBeDisabled();
  });

  it('has proper form structure', () => {
    render(<LoginFormWrapper />);

    const form = screen
      .getByRole('button', { name: 'Sign In' })
      .closest('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('novalidate');
  });

  it('renders form inputs with proper Bootstrap classes', () => {
    render(<LoginFormWrapper />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toHaveClass('form-control');
    expect(passwordInput).toHaveClass('form-control');
  });

  it('has proper spacing in form', () => {
    const { container } = render(<LoginFormWrapper />);

    const formGroups = container.querySelectorAll('.mb-3');
    expect(formGroups.length).toBeGreaterThan(0);
  });
});
