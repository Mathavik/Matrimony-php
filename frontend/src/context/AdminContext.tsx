import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../axiosInstance';

interface AdminContextType {
  adminName: string;
  adminEmail: string;
  updateAdminInfo: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  const updateAdminInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('/api/admin/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.admin) {
        setAdminName(response.data.admin.name);
        setAdminEmail(response.data.admin.email);
      }
    } catch (error) {
      console.error('Error fetching admin info:', error);
    }
  };

  useEffect(() => {
    updateAdminInfo();
  }, []);

  return (
    <AdminContext.Provider value={{ adminName, adminEmail, updateAdminInfo }}>
      {children}
    </AdminContext.Provider>
  );
};