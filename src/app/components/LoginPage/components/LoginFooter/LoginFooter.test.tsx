import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginFooter } from './LoginFooter';

// Helper to render with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginFooter', () => {
  it('should render register message', () => {
    renderWithRouter(<LoginFooter />);

    expect(screen.getByText(/Don't have an account?/)).toBeInTheDocument();
  });

  it('should render register link', () => {
    renderWithRouter(<LoginFooter />);

    const link = screen.getByRole('link', { name: 'Register' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/register');
  });

  it('should have correct Bootstrap classes', () => {
    renderWithRouter(<LoginFooter />);

    const container = screen.getByText(/Don't have an account?/).parentElement;
    expect(container).toHaveClass('text-center', 'mt-3');
  });

  it('should style text as muted', () => {
    renderWithRouter(<LoginFooter />);

    const smallText = screen.getByText(/Don't have an account?/);
    expect(smallText).toHaveClass('text-muted');
  });

  it('should style link without decoration', () => {
    renderWithRouter(<LoginFooter />);

    const link = screen.getByRole('link', { name: 'Register' });
    expect(link).toHaveClass('text-decoration-none');
  });

  it('should render as small element', () => {
    renderWithRouter(<LoginFooter />);

    const smallElement = screen.getByText(/Don't have an account?/);
    expect(smallElement?.tagName.toLowerCase()).toBe('small');
  });

  it('should render without any props', () => {
    expect(() => renderWithRouter(<LoginFooter />)).not.toThrow();
  });

  it('should have proper text content with link', () => {
    renderWithRouter(<LoginFooter />);

    // Check that the full text is rendered correctly
    expect(screen.getByText(/Don't have an account?/)).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = renderWithRouter(<LoginFooter />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
