'use client';

import { createContext, useContext, useState} from 'react';
import jwt from 'jsonwebtoken';

interface SessionType {
    email: string;
    expiresIn: Date;
}

interface AuthContextType {
    isAuthenticated: boolean;
    session: SessionType | undefined;
    authenticate: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [session, setSession] = useState<SessionType | undefined>(undefined);

    const authenticate = (token: string) => {
        try {
            const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string) as SessionType;
            const expirationDate = new Date(decoded.expiresIn);
            if (expirationDate > new Date()) {
                setSession(decoded);
            }
        } catch (error) {
            console.error("Error verifying token:", error);
        }

    }

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!session, session, authenticate }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
