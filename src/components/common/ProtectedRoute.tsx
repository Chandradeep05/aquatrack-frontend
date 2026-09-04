import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Droplets } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'admin' | 'user';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="p-4 bg-brand-50 rounded-2xl border border-brand-200 animate-pulse mb-4">
          <Droplets className="w-10 h-10 text-brand-500 animate-bounce" />
        </div>
        <p className="text-slate-600 font-medium text-sm">Loading AquaTrack...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  }

  return <>{children}</>;
};
