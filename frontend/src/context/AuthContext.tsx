import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  activeWeddingId: string;
  setActiveWeddingId: (id: string) => void;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsRole: (role: 'couple' | 'vendor' | 'planner' | 'admin') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('royal_knot_token'));
  const [activeWeddingId, setActiveWeddingId] = useState<string>('wedding-jaipur-demo-400');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const userData = await api.getMe();
        setUser(userData);
      } catch (err) {
        console.warn('Session expired or invalid token:', err);
        localStorage.removeItem('royal_knot_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.login({ email, password });
      localStorage.setItem('royal_knot_token', data.access_token);
      setToken(data.access_token);
      setUser({
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        is_active: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsRole = async (role: 'couple' | 'vendor' | 'planner' | 'admin') => {
    const roleEmails = {
      couple: 'couple@theroyalknot.com',
      vendor: 'vendor@theroyalknot.com',
      planner: 'planner@theroyalknot.com',
      admin: 'admin@theroyalknot.com',
    };
    await login(roleEmails[role], 'password123');
  };

  const logout = () => {
    localStorage.removeItem('royal_knot_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeWeddingId,
        setActiveWeddingId,
        isLoading,
        login,
        loginAsRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
