import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';
import Lottie from 'lottie-react';



const defaultOptions = {
    loop: true,
    autoplay: true,
    // animationData: loaderData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                 <Lottie options={defaultOptions} height={300} width={300} />
            </div>
        );
    }

    if (user) {
        return children;
    }

    return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoutes;