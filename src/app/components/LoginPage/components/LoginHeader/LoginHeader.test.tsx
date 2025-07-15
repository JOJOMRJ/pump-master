import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginHeader } from './LoginHeader';

describe('LoginHeader', () => {
  it('should render welcome message', () => {
    render(<LoginHeader />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Welcome back');
  });

  it('should have correct Bootstrap classes', () => {
    render(<LoginHeader />);

    const container = screen.getByText('Welcome back').parentElement;
    expect(container).toHaveClass('text-center', 'mb-4');
  });

  it('should render as h2 element with h3 class', () => {
    render(<LoginHeader />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('h3', 'mb-1');
  });

  it('should render without any props', () => {
    expect(() => render(<LoginHeader />)).not.toThrow();
  });

  it('should match snapshot', () => {
    const { container } = render(<LoginHeader />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
