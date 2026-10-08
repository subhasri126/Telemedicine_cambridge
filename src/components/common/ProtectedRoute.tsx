import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole: 'patient' | 'doctor';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
    const { role, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-semibold text-slate-600">Verifying security credentials...</p>
                </div>
            </div>
        );
    }

    if (role !== allowedRole) {
        // Redirect to correct dashboard based on current role
        if (role === 'doctor') {
            return <Navigate to="/doctor/dashboard" replace />;
        } else {
            return <Navigate to="/patient/dashboard" replace />;
        }
    }

    return <>{children}</>;
};
