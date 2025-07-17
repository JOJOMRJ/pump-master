import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';

const LoginPageWrapper = () => (
  <BrowserRouter>
    <LoginPage />
  </BrowserRouter>
);

describe('LoginPage', () => {
  it('renders login page with all components', () => {
    render(<LoginPageWrapper />);
    
    expect(screen.getByText('Welcome to Pump Master')).toBeInTheDocument();
    expect(screen.getByText('Your agricultural pump management solution')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText('© 2024 InformAG. All rights reserved.')).toBeInTheDocument();
  });

  it('renders login form', () => {
    render(<LoginPageWrapper />);
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('uses centered container layout', () => {
    const { container } = render(<LoginPageWrapper />);
    
    const centeredContainer = container.querySelector('.d-flex.justify-content-center.align-items-center');
    expect(centeredContainer).toBeInTheDocument();
  });

  it('renders header component', () => {
    render(<LoginPageWrapper />);
    
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders footer component', () => {
    render(<LoginPageWrapper />);
    
    expect(screen.getByText('© 2024 InformAG. All rights reserved.')).toBeInTheDocument();
  });

  it('has proper page structure', () => {
    const { container } = render(<LoginPageWrapper />);
    
    const mainContainer = container.querySelector('.container-fluid');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('vh-100');
  });

  it('renders login form in card format', () => {
    render(<LoginPageWrapper />);
    
    const card = screen.getByRole('button', { name: 'Sign In' }).closest('.card');
    expect(card).toBeInTheDocument();
  });

  it('has responsive design elements', () => {
    const { container } = render(<LoginPageWrapper />);
    
    const col = container.querySelector('.col-12.col-md-6.col-lg-4');
    expect(col).toBeInTheDocument();
  });

  it('maintains proper spacing', () => {
    const { container } = render(<LoginPageWrapper />);
    
    const spacingElement = container.querySelector('.p-4');
    expect(spacingElement).toBeInTheDocument();
  });
});