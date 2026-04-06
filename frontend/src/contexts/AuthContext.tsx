'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../api/client';

export interface User {
  id: string;
  email: string;
  name: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: (email: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'famly-token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async (authToken: string) => {
    try {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      const response = await apiClient.get('/auth/me');
      setUser(response.data);
      return response.data;
    } catch (error) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      setUser(null);
      delete apiClient.defaults.headers.common['Authorization'];
      throw error;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (savedToken) {
        setToken(savedToken);
        try {
          await fetchUser(savedToken);
        } catch {
          // Token invalid, already handled in fetchUser
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [fetchUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await apiClient.post('/auth/login', { email, password });
      const { access_token } = response.data;

      localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
      setToken(access_token);
      await fetchUser(access_token);
    },
    [fetchUser]
  );

  const demoLogin = useCallback(
    async (email: string) => {
      const response = await apiClient.post('/auth/demo-login', { email });
      const { access_token } = response.data;

      localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
      setToken(access_token);
      await fetchUser(access_token);
    },
    [fetchUser]
  );

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        name,
      });
      const { access_token } = response.data;

      localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
      setToken(access_token);
      await fetchUser(access_token);
    },
    [fetchUser]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
    router.push('/login');
  }, [router]);

  const refreshUser = useCallback(async () => {
    if (token) {
      await fetchUser(token);
    }
  }, [token, fetchUser]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      demoLogin,
      register,
      logout,
      refreshUser,
    }),
    [user, token, isLoading, login, demoLogin, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
