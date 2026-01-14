'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserCredentials } from '@/types';
import { registerUser, loginUser } from '@/services/apiService';

interface AuthState {
    userId: string | null;
    username: string | null;
    isAuthenticated: boolean;
    login: (creds: UserCredentials) => Promise<void>;
    register: (creds: UserCredentials) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check local storage on mount
    useEffect(() => {
        const storedUserId = localStorage.getItem('atlast_user_id');
        const storedUsername = localStorage.getItem('atlast_username');
        if (storedUserId && storedUsername) {
            setUserId(storedUserId);
            setUsername(storedUsername);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (creds: UserCredentials) => {
        try {
            const response = await loginUser(creds);
            setUserId(response.user_id);
            setUsername(creds.username);
            setIsAuthenticated(true);

            localStorage.setItem('atlast_user_id', response.user_id);
            localStorage.setItem('atlast_username', creds.username);
        } catch (error) {
            console.error('Login failed in context:', error);
            throw error;
        }
    };

    const register = async (creds: UserCredentials) => {
        try {
            const response = await registerUser(creds);
            setUserId(response.user_id);
            setUsername(creds.username);
            setIsAuthenticated(true);

            localStorage.setItem('atlast_user_id', response.user_id);
            localStorage.setItem('atlast_username', creds.username);
        } catch (error) {
            console.error('Registration failed in context:', error);
            throw error;
        }
    };

    const logout = () => {
        setUserId(null);
        setUsername(null);
        setIsAuthenticated(false);
        localStorage.removeItem('atlast_user_id');
        localStorage.removeItem('atlast_username');
    };

    return (
        <AuthContext.Provider value={{ userId, username, isAuthenticated, login, register, logout, loading }}>
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
