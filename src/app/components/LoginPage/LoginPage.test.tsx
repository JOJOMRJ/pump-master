import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { LoginPage } from './LoginPage';

const LoginPageWrapper = () => (
  <BrowserRouter>
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  </BrowserRouter>
);

describe('LoginPage', () => {
  it('renders login page with all components', () => {
    render(<LoginPageWrapper />);

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('renders login form', () => {
    render(<LoginPageWrapper />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('uses centered container layout', () => {
    const { container } = render(<LoginPageWrapper />);

    const loginContainer = container.querySelector('.p-4');
    expect(loginContainer).toBeInTheDocument();
    expect(loginContainer).toHaveStyle('width: 400px');
  });

  it('renders header component', () => {
    render(<LoginPageWrapper />);

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders footer component', () => {
    render(<LoginPageWrapper />);

    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('has proper page structure', () => {
    const { container } = render(<LoginPageWrapper />);

    const mainContainer = container.querySelector('.p-4');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveStyle('width: 400px');
  });

  it('renders login form in correct format', () => {
    render(<LoginPageWrapper />);

    const form = screen
      .getByRole('button', { name: 'Sign In' })
      .closest('form');
    expect(form).toBeInTheDocument();
  });

  it('has correct container styling', () => {
    const { container } = render(<LoginPageWrapper />);

    const loginContainer = container.querySelector('.p-4');
    expect(loginContainer).toBeInTheDocument();
  });

  it('maintains proper spacing', () => {
    const { container } = render(<LoginPageWrapper />);

    const spacingElement = container.querySelector('.p-4');
    expect(spacingElement).toBeInTheDocument();
    expect(spacingElement).toHaveStyle('width: 400px');
  });
});
