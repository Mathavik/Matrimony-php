import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../axiosInstance';

interface AuthContextType {
  userName: string | null;
  setUserName: (name: string | null) => void;
  updateUserName: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage so UI (header) retains name after page refresh
  const [userName, setUserName] = useState<string | null>(() => {
    try {
      return localStorage.getItem('userName') || null;
    } catch (e) {
      return null;
    }
  });

  const updateUserName = async () => {
    try {
      // If we already have a cached name, use it (avoids an extra network call on refresh)
      const cachedName = localStorage.getItem('userName');
      if (cachedName) {
        setUserName(cachedName);
        return;
      }

      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        setUserName(null);
        return;
      }

      const response = await axios.get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.user && (response.data.user.name || response.data.user.fullName)) {
        const name = response.data.user.name || response.data.user.fullName;
        setUserName(name);
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
      setUserName(null);
    }
  };

  // Keep localStorage in sync whenever userName changes
  useEffect(() => {
    try {
      if (userName) localStorage.setItem('userName', userName);
      else localStorage.removeItem('userName');
    } catch (e) {
      // ignore localStorage errors (e.g., in private mode)
    }
  }, [userName]);

  useEffect(() => {
    updateUserName();
  }, []);

  // Listen for manual login/logout events from other parts of the app or other tabs
  useEffect(() => {
    const handleUserChange = () => {
      try {
        const name = localStorage.getItem('userName');
        setUserName(name);
      } catch (e) {
        setUserName(null);
      }
    };

    window.addEventListener('userLoginChange', handleUserChange);
    const storageListener = (e: StorageEvent) => {
      if (!e.key) return;
      if (['userName', 'token', 'userId'].includes(e.key)) handleUserChange();
    };
    window.addEventListener('storage', storageListener);

    return () => {
      window.removeEventListener('userLoginChange', handleUserChange);
      window.removeEventListener('storage', storageListener);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userName, setUserName, updateUserName }}>
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