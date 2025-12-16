import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQueryClient } from '@tanstack/react-query';
import { FaUserCircle, FaCrown, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const { role, isPremium, isBlocked, roleLoading } = useRole();
    const { register, handleSubmit, setValue } = useForm();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

   
    React.useEffect(() => {
        if (user) {
            setValue('displayName', user.displayName || '');
            setValue('email', user.email || ''); 
        }
    }, [user, setValue]);

    const handleProfileUpdate = (data) => {
        updateUserProfile({ displayName: data.displayName })
            .then(() => {
                Swal.fire('Success', 'Profile updated successfully!', 'success');
                queryClient.invalidateQueries({ queryKey: ['user-status', user.email] });
            })
            .catch(error => {
                Swal.fire('Error', error.message, 'error');
            });
    };

    const handleSubscription = async () => {
        const subscriptionCost = 1000; 
        
        Swal.fire({
            title: "Confirm Subscription?",
            text: `You will be charged ${subscriptionCost} Taka for a Premium Subscription.`,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Proceed to Payment"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.post('/subscription-checkout-session', { cost: subscriptionCost });
                    
                    window.location.href = res.data.url;
                } catch (error) {
                    Swal.fire('Error', 'Failed to initiate payment. Please try again.', 'error');
                }
            }
        });
    };

    if (roleLoading) {
        return <span className="loading loading-infinity loading-xl block mx-auto mt-20"></span>;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
            <div className="text-center mb-6 border-b pb-4">
                <div className="avatar mb-4">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={user?.photoURL || 'https://via.placeholder.com/150'} alt="Profile" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold flex items-center justify-center">
                    {user?.displayName}
                    {isPremium && <FaCrown className="text-yellow-500 ml-3" data-tip="Premium User" />}
                </h2>
                <p className="text-gray-500">Role: <span className="font-semibold capitalize">{role}</span></p>
                
                {isBlocked && (
                     <div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-center'>
                         <FaExclamationTriangle className="mr-2" />
                         <span className="font-bold">ACCOUNT BLOCKED!</span> Contact authorities for assistance.
                     </div>
                )}
            </div>

            <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-4">
                
                <label className="form-control w-full">
                    <div className="label"><span className="label-text font-semibold">Full Name</span></div>
                    <input type="text" {...register('displayName', { required: true })} className="input input-bordered w-full" />
                    {errors.displayName && <span className="text-red-500 text-sm mt-1">Name is required</span>}
                </label>

                <label className="form-control w-full">
                    <div className="label"><span className="label-text font-semibold">Email (Read-Only)</span></div>
                    <input type="email" {...register('email')} className="input input-bordered w-full bg-gray-100" readOnly />
                </label>

                <button type="submit" className="btn btn-primary w-full text-black">
                    Update Profile
                </button>
            </form>
            
            <div className="divider">Subscription Status</div>

            {isPremium ? (
                <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg border border-green-300">
                    <FaCheckCircle className="text-green-500 text-xl mr-3" />
                    <span className="font-semibold text-green-700">You are a Premium Citizen! Enjoy unlimited reporting.</span>
                </div>
            ) : (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-300 text-center">
                    <p className="mb-3 text-yellow-700">Upgrade to Premium to report **unlimited issues** and get priority support.</p>
                    <button 
                        onClick={handleSubscription} 
                        className="btn btn-warning w-full text-black"
                        disabled={isBlocked}
                    >
                        Subscribe Now (1000 Taka)
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;