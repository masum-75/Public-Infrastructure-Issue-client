import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const transactionId = query.get('transactionId');

    useEffect(() => {
        if (!transactionId) {
            Swal.fire('Error', 'Invalid transaction ID or payment not completed.', 'error');
            setTimeout(() => navigate('/dashboard/profile'), 3000);
            return;
        }

        Swal.fire({
            title: 'Payment Successful!',
            text: `Transaction ID: ${transactionId}. Your subscription/boost is now active.`,
            icon: 'success',
            showConfirmButton: false,
            timer: 4000
        });

      
        const timer = setTimeout(() => {
            navigate('/dashboard/profile');
        }, 4000);

        return () => clearTimeout(timer);
    }, [transactionId, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-50">
            <FaCheckCircle className="text-green-500 text-6xl mb-4 animate-bounce" />
            <h1 className="text-3xl font-bold text-green-700">Processing Payment Confirmation...</h1>
            <p className="mt-2 text-gray-600">Please wait, you are being redirected.</p>
            <FaSpinner className="text-primary mt-6 text-3xl animate-spin" />
        </div>
    );
};

export default PaymentSuccess;