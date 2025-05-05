import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User, UserSegment, AuthFormData } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: AuthFormData) => Promise<void>;
  signup: (data: AuthFormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ VITE backend API base URL
const API = import.meta.env.VITE_API_BASE;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('feelio-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (data: AuthFormData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/login`, {
        email: data.email,
        password: data.password,
      });

      const userFromServer: User = {
        id: String(response.data.user_id),
        name: response.data.name,
        email: data.email,
        segment: response.data.segment === 1 ? '7-9' : '10-12',
        totalScore: 0,
        createdAt: new Date().toISOString(),
      };

      setUser(userFromServer);
      localStorage.setItem('feelio-user', JSON.stringify(userFromServer));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: AuthFormData) => {
    setLoading(true);
    try {
      const segmentNumber = data.segment === '7-9' ? 1 : 2;

      await axios.post(`${API}/signup`, {
        name: data.name,
        email: data.email,
        password: data.password,
        segment: segmentNumber,
      });

      // ✅ no auto-login — navigate in Signup.tsx after this
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('feelio-user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
