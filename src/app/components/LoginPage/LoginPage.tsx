import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { LoginHeader, LoginForm, LoginFooter } from './components';

interface LoginFormData {
  username: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [failureMessage, setFailureMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setFailureMessage('');

    const success = await login(data.username, data.password);

    if (!success) {
      setFailureMessage('Invalid username or password');
      setIsLoading(false);
      return;
    }

    // Success! Navigate to dashboard
    navigate('/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="p-4" style={{ width: '400px' }}>
      <LoginHeader />
      <LoginForm
        isLoading={isLoading}
        error={failureMessage}
        onSubmit={handleLogin}
      />
      <LoginFooter />
    </div>
  );
};
