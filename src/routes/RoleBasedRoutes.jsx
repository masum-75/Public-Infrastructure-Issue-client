import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import { Navigate, useLocation } from 'react-router';

const RoleBasedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();
    const { role, roleLoading } = useRole();
    const location = useLocation();

    if (loading || roleLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
    }

    if (role === requiredRole) {
        return children;
    }

    return (
        <div className="flex flex-col items-center justify-center text-center p-12 min-h-screen">
            <h2 className="text-4xl font-bold text-red-500 mb-4">403 - Access Denied</h2>
            <p className="text-lg">You do not have the required role ({requiredRole}) to view this page.</p>
            <p className="text-gray-500 mb-6">Your current role is: <span className="font-mono font-bold text-blue-600">{role || 'No Role Found'}</span></p>
            <Navigate to="/dashboard/profile" replace />
        </div>
    );
};


export const AdminRoute = ({ children }) => <RoleBasedRoute requiredRole="admin">{children}</RoleBasedRoute>;
export const StaffRoute = ({ children }) => <RoleBasedRoute requiredRole="staff">{children}</RoleBasedRoute>;
export const CitizenRoute = ({ children }) => <RoleBasedRoute requiredRole="citizen">{children}</RoleBasedRoute>;

export default RoleBasedRoute;