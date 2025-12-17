import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentCancelled = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/dashboard/profile');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-50">
            <FaTimesCircle className="text-red-500 text-6xl mb-4" />
            <h1 className="text-3xl font-bold text-red-700">Payment Failed or Cancelled.</h1>
            <p className="mt-4 text-gray-600">Your transaction was not completed. Please try again later.</p>
            <p className="mt-2 text-sm">You will be redirected to your profile shortly...</p>
        </div>
    );
};

export default PaymentCancelled;