'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface SessionType {
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  session: SessionType | undefined;
  authenticate: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clave para el localStorage
const AUTH_STORAGE_KEY = 'hospitapp_auth_state';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<SessionType | undefined>(() => {
    // Inicializar desde localStorage si existe
    if (typeof window !== 'undefined') {
      const savedState = sessionStorage.getItem(AUTH_STORAGE_KEY);
      return savedState ? JSON.parse(savedState) : undefined;
    }
    return undefined;
  });

  // Persistir cambios en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (session) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      } else {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, [session]);

  const authenticate = (email: string) => {
    setSession({ email });
  };

  const logout = () => {
    setSession(undefined);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hospitapp_auth_state');
      sessionStorage.removeItem('hospitapp_auth_state');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!session, 
      session, 
      authenticate, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};