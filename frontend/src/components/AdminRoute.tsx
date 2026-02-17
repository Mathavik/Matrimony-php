import React from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

const AdminRoute: React.FC<Props> = ({ children }) => {
  // Use the presence of adminToken to determine authentication.
  // This is a simple client-side guard; for stronger protection you can
  // verify the token with the backend on mount.
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Wrap children in a fragment so we always return a React element
  return <>{children}</>;
};

export default AdminRoute;
