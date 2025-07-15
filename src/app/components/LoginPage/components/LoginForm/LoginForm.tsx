import React from 'react';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import {
  FormInput,
  LoadingButton,
  ErrorAlert,
} from '../../../../../shared/components';

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  error?: string;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  error,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormInput
        label="Email"
        type="email"
        placeholder="Enter your email"
        register={register('username', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
        error={errors.username}
        className="mb-3"
      />

      <FormInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        register={register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        })}
        error={errors.password}
        className="mb-3"
      />

      {error && <ErrorAlert message={error} />}

      <LoadingButton
        type="submit"
        isLoading={isLoading}
        className="w-100"
        variant="primary"
      >
        Sign In
      </LoadingButton>
    </Form>
  );
};

export default LoginForm;
