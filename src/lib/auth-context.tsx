import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from './types';

const DEFAULT_API_KEY = "tu_clave_api_por_defecto";

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string, name: string) => Promise<void>;
  signOut: () => void;
  updateApiKey: (apiKey: string) => void;
  getApiKey: () => string;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string) => {
    setIsLoading(true);
    try {
      const mockUser: User = {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        email,
        name: email.split('@')[0],
        plan: 'free',
        createdAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, name: string) => {
    setIsLoading(true);
    try {
      const mockUser: User = {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        email,
        name,
        plan: 'free',
        createdAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateApiKey = (apiKey: string) => {
    if (user) {
      const updatedUser = { ...user, apiKey };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const getApiKey = () => {
    return user?.apiKey || DEFAULT_API_KEY;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateApiKey, getApiKey }}>
      {children}
    </AuthContext.Provider>
  );
};
