import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { api } from '@/services/api';
import { storage } from '@/utils/storage';
import { User, AuthSession } from '@/types';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithBiometric: () => Promise<void>;
  isBiometricAvailable: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    checkBiometricAvailability();
  }, []);

  async function checkAuthStatus() {
    try {
      const token = await storage.getAuthToken();
      if (token) {
        const userData = await api.getCurrentUser();
        setUser(userData);
        setSession({ access_token: token, expires_at: 0, user: userData });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      await storage.clearAuthToken();
    } finally {
      setLoading(false);
    }
  }

  async function checkBiometricAvailability() {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsBiometricAvailable(compatible && enrolled);
  }

  async function login(email: string, password: string) {
    try {
      const response = await api.login(email, password);
      const token = response.session.access_token;

      await storage.setAuthToken(token);
      await storage.setUserData(response.user);

      setUser(response.user);
      setSession(response.session);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  async function register(email: string, password: string) {
    try {
      const response = await api.register(email, password);
      const token = response.session.access_token;

      await storage.setAuthToken(token);
      await storage.setUserData(response.user);

      setUser(response.user);
      setSession(response.session);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  async function logout() {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await storage.clearAuthToken();
      await storage.remove('user_data');
      setUser(null);
      setSession(null);
    }
  }

  async function loginWithBiometric() {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login to FitForge',
        fallbackLabel: 'Use password',
      });

      if (result.success) {
        const token = await storage.getAuthToken();
        if (token) {
          const userData = await api.getCurrentUser();
          setUser(userData);
          setSession({ access_token: token, expires_at: 0, user: userData });
        }
      } else {
        throw new Error('Biometric authentication failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Biometric login failed');
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loginWithBiometric,
        isBiometricAvailable,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
