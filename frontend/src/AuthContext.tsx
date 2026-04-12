import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthState } from './types';

interface AuthContextType extends AuthState {
  login: (response: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEYS = ['token', 'role', 'userId', 'userName'] as const;

function clearStoredAuth() {
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
}

function getStoredAuthState(): AuthState {
  const token = localStorage.getItem('token');
  const storedRole = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const role = storedRole === 'STUDENT' || storedRole === 'FACULTY' ? storedRole : null;

  if (!token || !role) {
    clearStoredAuth();
    return {
      token: null,
      role: null,
      userId: null,
      userName: null,
    };
  }

  return {
    token,
    role,
    userId,
    userName,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => getStoredAuthState());

  const login = (response: any) => {
    const role = response.role === 'STUDENT' || response.role === 'FACULTY' ? response.role : null;
    const userId = response.studentRollNumber || response.facultyId;
    const userName = response.studentName || response.facultyName;

    if (!response.token || !role) {
      clearStoredAuth();
      setAuth({
        token: null,
        role: null,
        userId: null,
        userName: null,
      });
      return;
    }

    localStorage.setItem('token', response.token);
    localStorage.setItem('role', role);

    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }

    if (userName) {
      localStorage.setItem('userName', userName);
    } else {
      localStorage.removeItem('userName');
    }

    setAuth({
      token: response.token,
      role,
      userId,
      userName,
    });
  };

  const logout = () => {
    clearStoredAuth();

    setAuth({
      token: null,
      role: null,
      userId: null,
      userName: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
