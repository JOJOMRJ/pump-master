import React from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  register,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label" htmlFor={register.name}>
          {label}
        </label>
      )}
      <input
        {...register}
        {...props}
        className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
        id={register.name}
      />
      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
};

export default FormInput;
