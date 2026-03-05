import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, KycDetails } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
    user: User | null;
    kyc: KycDetails | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [kyc, setKyc] = useState<KycDetails | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const data = await api.getMe();
            setUser(data.user);
            setKyc(data.kyc || null);
        } catch {
            setUser(null);
            setKyc(null);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            refreshUser().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const data: any = await api.login({ email, password });
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
    };

    const register = async (regData: any) => {
        const data: any = await api.register(regData);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setKyc(null);
    };

    return (
        <AuthContext.Provider value={{ user, kyc, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
