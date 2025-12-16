import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import PreLoader from '../components/ui/PreLoader';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage if available
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            // Check if token exists
            if (token) {
                 await checkUserLoggedIn();
            }
            
            // Enforce minimum 3 seconds loading time for the professional feel
            // Calculate remaining time if auth check was faster than 3s, or release immediately if it took longer
            setTimeout(() => {
                setLoading(false);
            }, 3000); 
        };

        initAuth();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data.data); 
        } catch (error) {
            console.error("Auth Check Failed", error);
            logout();
        } 
        // Note: setLoading(false) is now handled in the useEffect timeout to guarantee the delay
    };

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        // Expecting { success: true, token: "..." }
        const newToken = res.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        
        // After login, fetch user details
        await checkUserLoggedIn();
        return res.data;
    };

    const register = async (name, email, password, role) => {
        const res = await api.post('/auth/register', { name, email, password, role });
        const newToken = res.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        await checkUserLoggedIn();
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <PreLoader /> : children}
        </AuthContext.Provider>
    );
};
