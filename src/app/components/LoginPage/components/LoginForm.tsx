import React from 'react';
import { useForm } from 'react-hook-form';
import {
  FormInput,
  LoadingButton,
  ErrorAlert,
} from '../../../../shared/components';

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginFormProps {
  isLoading: boolean;
  failureMessage: string;
  onSubmit: (data: LoginFormData) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  isLoading,
  failureMessage,
  onSubmit,
}) => {
  const { register, handleSubmit } = useForm<LoginFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormInput
        label="Username"
        type="text"
        placeholder="Enter your username"
        register={register('username', { required: true })}
        aria-label="Username"
      />

      <FormInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        register={register('password', { required: true })}
        aria-label="Password"
      />

      <LoadingButton
        type="submit"
        isLoading={isLoading}
        loadingText="Logging in..."
        fullWidth
      >
        Log in
      </LoadingButton>

      <ErrorAlert message={failureMessage} className="mt-3 mb-0" />
    </form>
  );
};

export default LoginForm;
