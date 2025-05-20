import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isImpersonating } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🛑 Block true child accounts from accessing restricted routes
  const kidBlockedRoutes = ['/statistics']; // add more if needed
  const isKidTryingToAccessRestricted = user.role === 'kid' && !isImpersonating && kidBlockedRoutes.includes(location.pathname);

  if (isKidTryingToAccessRestricted) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
