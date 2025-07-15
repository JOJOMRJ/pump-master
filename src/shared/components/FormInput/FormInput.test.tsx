import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormInput } from './FormInput';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

// Mock register object
const createMockRegister = (name = 'testInput'): UseFormRegisterReturn => ({
  name,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
});

// Mock FieldError
const createMockError = (message = 'Error message'): FieldError => ({
  type: 'required',
  message,
});

describe('FormInput', () => {
  it('should render basic input without label', () => {
    const mockRegister = createMockRegister();

    render(<FormInput register={mockRegister} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('form-control');
    expect(input).toHaveAttribute('id', 'testInput');
  });

  it('should render input with label', () => {
    const mockRegister = createMockRegister('email');
    const labelText = 'Email Address';

    render(<FormInput register={mockRegister} label={labelText} />);

    const label = screen.getByText(labelText);
    const input = screen.getByRole('textbox');

    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('form-label');
    expect(label).toHaveAttribute('for', 'email');
    expect(input).toHaveAttribute('id', 'email');
  });

  it('should not render label when label prop is not provided', () => {
    const mockRegister = createMockRegister();

    render(<FormInput register={mockRegister} />);

    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('should display error message when error is provided', () => {
    const mockRegister = createMockRegister();
    const mockError = createMockError('This field is required');

    render(<FormInput register={mockRegister} error={mockError} />);

    const input = screen.getByRole('textbox');
    const errorMessage = screen.getByText('This field is required');

    expect(input).toHaveClass('is-invalid');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('invalid-feedback');
  });

  it('should not display error message when error is not provided', () => {
    const mockRegister = createMockRegister();

    render(<FormInput register={mockRegister} />);

    const input = screen.getByRole('textbox');

    expect(input).not.toHaveClass('is-invalid');
    expect(screen.queryByText(/invalid-feedback/)).not.toBeInTheDocument();
  });

  it('should handle different input types', () => {
    const mockRegister = createMockRegister('password');

    const { container } = render(
      <FormInput register={mockRegister} type="password" />
    );

    const input = container.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should apply custom className', () => {
    const mockRegister = createMockRegister();
    const customClass = 'custom-input';

    render(<FormInput register={mockRegister} className={customClass} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('form-control', customClass);
  });

  it('should pass through HTML attributes', () => {
    const mockRegister = createMockRegister();

    render(
      <FormInput
        register={mockRegister}
        placeholder="Enter text"
        disabled
        required
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
  });

  it('should combine error class with custom className', () => {
    const mockRegister = createMockRegister();
    const mockError = createMockError();
    const customClass = 'custom-input';

    render(
      <FormInput
        register={mockRegister}
        error={mockError}
        className={customClass}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('form-control', 'is-invalid', customClass);
  });

  it('should handle empty error message', () => {
    const mockRegister = createMockRegister();
    const mockError = createMockError('');

    const { container } = render(
      <FormInput register={mockRegister} error={mockError} />
    );

    const input = screen.getByRole('textbox');
    const errorDiv = container.querySelector('.invalid-feedback');

    expect(input).toHaveClass('is-invalid');
    expect(errorDiv).toBeInTheDocument();
    expect(errorDiv).toHaveClass('invalid-feedback');
    expect(errorDiv?.textContent).toBe('');
  });

  it('should have proper label-input association', () => {
    const mockRegister = createMockRegister('username');
    const labelText = 'Username';

    render(<FormInput register={mockRegister} label={labelText} />);

    const input = screen.getByLabelText(labelText);
    expect(input).toHaveAttribute('id', 'username');
  });
});
