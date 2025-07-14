import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CenterLayout } from '../../../shared/layouts';
import { LoginHeader, LoginForm, LoginFooter } from './components';

interface LoginFormData {
  username: string;
  password: string;
}

// Mock login validation - can be easily replaced later
const validateLogin = async (
  username: string,
  password: string
): Promise<boolean> => {
  // Simulate real async request
  await new Promise(resolve => setTimeout(resolve, 1000));

  // TODO: Replace with real authentication service later
  return username === 'admin@informag.com' && password === 'admin123';
};

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [failureMessage, setFailureMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setFailureMessage('');

    const isValid = await validateLogin(data.username, data.password);

    if (!isValid) {
      setFailureMessage('Invalid email or password');
      setIsLoading(false);
      return;
    }

    navigate('/dashboard');
    setIsLoading(false);
  };

  return (
    <CenterLayout>
      <div className="p-4" style={{ width: '400px' }}>
        <LoginHeader />
        <LoginForm
          isLoading={isLoading}
          failureMessage={failureMessage}
          onSubmit={handleLogin}
        />
        <LoginFooter />
      </div>
    </CenterLayout>
  );
};
