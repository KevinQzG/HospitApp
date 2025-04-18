'use client';

import { createContext, useContext, useState } from 'react';

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<SessionType | undefined>(undefined);

  const authenticate = (email: string) => {
      setSession({ email });

  };

  const logout = () => {
    setSession(undefined);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!session, session, authenticate, logout }}>
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
