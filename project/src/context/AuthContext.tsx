import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserSegment, AuthFormData } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: AuthFormData) => Promise<void>;
  signup: (data: AuthFormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'Budi',
  email: 'budi@example.com',
  segment: '7-9',
  totalScore: 120,
  createdAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('feelio-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (data: AuthFormData) => {
    setLoading(true);
    try {
      // Mock API call - in real app, this would be a fetch request to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use the mock user for now
      setUser(mockUser);
      localStorage.setItem('feelio-user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: AuthFormData) => {
    setLoading(true);
    try {
      // Mock API call - in real app, this would be a fetch request to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user with the provided data
      const newUser: User = {
        ...mockUser,
        name: data.name || 'User',
        email: data.email,
        segment: data.segment || '7-9',
        totalScore: 0,
      };
      
      setUser(newUser);
      localStorage.setItem('feelio-user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error('Signup failed');
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