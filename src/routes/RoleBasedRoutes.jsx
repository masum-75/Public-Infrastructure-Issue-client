import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import { Navigate, useLocation } from 'react-router';
import Lottie from 'react-lottie';
import loaderData from '../assets/lottie/infinity-loader.json';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};


const RoleBasedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();
    const { role, roleLoading } = useRole();
    const location = useLocation();

    if (loading || roleLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                 <Lottie options={defaultOptions} height={300} width={300} />
            </div>
        );
    }


    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
    }


    if (role === requiredRole) {
        return children;
    }


    return <div className="text-center p-12 min-h-screen">
        <h2 className="text-4xl text-red-500">403 - Access Denied</h2>
        <p>You do not have the required role ({requiredRole}) to view this page. Your current role is: {role}.</p>
        <Navigate to="/dashboard/profile" replace />
    </div>;
};

// Specific role components
export const AdminRoute = ({ children }) => <RoleBasedRoute requiredRole="admin">{children}</RoleBasedRoute>;
export const StaffRoute = ({ children }) => <RoleBasedRoute requiredRole="staff">{children}</RoleBasedRoute>;
export const CitizenRoute = ({ children }) => <RoleBasedRoute requiredRole="citizen">{children}</RoleBasedRoute>;