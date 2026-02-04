import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const response = await authAPI.getCurrentUser();
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('accessToken');
            setUser(null);
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        localStorage.setItem('accessToken', response.data.accessToken);

        const userResponse = await authAPI.getCurrentUser();
        setUser(userResponse.data);

        return response;
    };

    const register = async (username, email, password) => {
        const response = await authAPI.register({ username, email, password });
        return response;
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            // Ignore errors during logout
        }
        localStorage.removeItem('accessToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
