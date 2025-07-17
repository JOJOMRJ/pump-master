import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { mockAuthService } from '../services/mockAuthService';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const parseUserFromToken = (token: string): User | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.userId,
        name: payload.name || payload.email.split('@')[0], // If no name, use email prefix
        email: payload.email,
        role: payload.role,
      };
    } catch {
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Use Mock authentication service instead of hardcoded logic
      const response = await mockAuthService.login({ email, password });

      if (response.success && response.data?.token && response.data?.user) {
        // Store token
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  // Check for token in localStorage on app startup
  useEffect(() => {
    const token = localStorage.getItem('token');

    // No token, return early
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Token expired, clear and return
    if (isTokenExpired(token)) {
      localStorage.removeItem('token');
      setIsLoading(false);
      return;
    }

    // Token valid, try to parse user info
    const user = parseUserFromToken(token);
    if (!user) {
      // Token parsing failed, clear invalid token
      localStorage.removeItem('token');
      setIsLoading(false);
      return;
    }

    // Successfully parsed, restore login state
    setUser(user);
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
