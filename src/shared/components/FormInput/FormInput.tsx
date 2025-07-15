import React from 'react';
import { Form } from 'react-bootstrap';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import type { FormControlProps } from 'react-bootstrap';

interface FormInputProps extends FormControlProps {
  label?: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  register,
  ...props
}) => {
  return (
    // controlId is used by <Form.Label> to automatically set htmlFor.
    <Form.Group className="mb-3" controlId={register.name}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control {...register} {...props} isInvalid={!!error} />
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default FormInput;
