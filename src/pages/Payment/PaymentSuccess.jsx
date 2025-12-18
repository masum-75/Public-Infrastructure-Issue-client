import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';


const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const query = new URLSearchParams(location.search);
    
    const sessionId = query.get('session_id');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                Swal.fire('Error', 'Invalid Session. Payment not completed.', 'error');
                navigate('/dashboard/profile');
                return;
            }

            try {
                const res = await axiosSecure.patch(`/payment-success?session_id=${sessionId}`);
                
                if (res.data.success) {
                    Swal.fire({
                        title: 'Payment Confirmed!',
                        text: 'Your account has been updated successfully.',
                        icon: 'success',
                        timer: 3000
                    });
                }
            } catch (error) {
                console.error("Verification Error:", error);
                Swal.fire('Error', 'Failed to update payment status in database.', 'error');
            } finally {
                setLoading(false);
                setTimeout(() => navigate('/dashboard/profile'), 3000);
            }
        };

        verifyPayment();
    }, [sessionId, navigate, axiosSecure]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
                <FaSpinner className="text-primary text-6xl animate-spin mb-4" />
                <h1 className="text-2xl font-bold text-blue-700">Verifying Your Payment...</h1>
                <p>Please do not close or refresh this page.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-50">
            <FaCheckCircle className="text-green-500 text-6xl mb-4" />
            <h1 className="text-3xl font-bold text-green-700">Payment Successful!</h1>
            <p className="mt-2 text-gray-600">Redirecting to your profile...</p>
        </div>
    );
};

export default PaymentSuccess;