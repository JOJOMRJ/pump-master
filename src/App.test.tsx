import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders Welcome back title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Welcome back/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    render(<App />);
  });
});
