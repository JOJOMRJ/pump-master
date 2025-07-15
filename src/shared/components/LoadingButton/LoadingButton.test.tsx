import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoadingButton } from './LoadingButton';

describe('LoadingButton', () => {
  it('should render children when not loading', () => {
    render(<LoadingButton>Click me</LoadingButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should show loading text and spinner when isLoading is true', () => {
    render(<LoadingButton isLoading>Click me</LoadingButton>);
    const button = screen.getByRole('button', { name: /loading.../i });
    expect(button).toBeDisabled();
    // Check for the loading text, which implies the spinner is present
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('should show custom loading text', () => {
    render(
      <LoadingButton isLoading loadingText="Processing...">
        Click me
      </LoadingButton>
    );
    const button = screen.getByRole('button', { name: /processing.../i });
    expect(button).toBeInTheDocument();
  });

  it('should apply variant class', () => {
    render(<LoadingButton variant="secondary">Click me</LoadingButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('btn-secondary');
  });

  it('should apply size class', () => {
    render(<LoadingButton size="lg">Click me</LoadingButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('btn-lg');
  });

  it('should apply custom className', () => {
    render(
      <LoadingButton className="w-100 custom-class">Click me</LoadingButton>
    );
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('w-100');
    expect(button).toHaveClass('custom-class');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<LoadingButton disabled>Click me</LoadingButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDisabled();
  });

  it('should not handle click events when loading', () => {
    const handleClick = vi.fn();
    render(
      <LoadingButton isLoading onClick={handleClick}>
        Click me
      </LoadingButton>
    );
    fireEvent.click(screen.getByRole('button', { name: /loading.../i }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should pass through HTML button attributes', () => {
    render(
      <LoadingButton type="submit" id="test-btn">
        Submit
      </LoadingButton>
    );
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('id', 'test-btn');
  });
});
