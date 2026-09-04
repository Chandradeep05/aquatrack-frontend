import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getMeApi, loginApi, registerApi } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aquatrack_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('aquatrack_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('aquatrack_token');
      if (storedToken) {
        try {
          const res = await getMeApi();
          if (res.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('aquatrack_user', JSON.stringify(res.data.user));
          }
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem('aquatrack_token');
          localStorage.removeItem('aquatrack_user');
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginApi(email, password);
    const loggedUser = res.data.user;
    const jwtToken = res.data.token;

    setUser(loggedUser);
    setToken(jwtToken);
    localStorage.setItem('aquatrack_user', JSON.stringify(loggedUser));
    localStorage.setItem('aquatrack_token', jwtToken);

    return loggedUser;
  };

  const register = async (name: string, email: string, password: string) => {
    await registerApi(name, email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aquatrack_token');
    localStorage.removeItem('aquatrack_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
