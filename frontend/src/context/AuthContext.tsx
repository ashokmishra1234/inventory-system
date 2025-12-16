import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';
import { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Force logout if data is stale (missing name or using default 'authenticated' role instead of app role)
      if (!parsedUser.name || parsedUser.role === 'authenticated') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } else {
        setUser(parsedUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (creds: any) => {
    const { data } = await client.post<AuthResponse>('/auth/login', creds);
    localStorage.setItem('token', data.session.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const signup = async (creds: any) => {
    await client.post('/auth/signup', creds);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
