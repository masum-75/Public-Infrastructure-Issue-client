import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQueryClient } from '@tanstack/react-query';
import { FaCrown, FaCheckCircle, FaExclamationTriangle, FaUser } from 'react-icons/fa';

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const { role, isPremium, isBlocked, isRoleLoading } = useRole();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
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
                queryClient.invalidateQueries({ queryKey: [user?.email, 'userRole'] });
            })
            .catch(error => {
                Swal.fire('Error', error.message, 'error');
            });
    };

    const handleSubscription = async () => {
        const subscriptionCost = 1000; 
        Swal.fire({
            title: "Confirm Subscription?",
            text: `Charge: ${subscriptionCost} Taka for Premium access.`,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Pay Now",
            confirmButtonColor: '#4F46E5'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.post('/subscription-checkout-session', { cost: subscriptionCost });
                    window.location.href = res.data.url;
                } catch (error) {
                    Swal.fire('Error', 'Payment failed!', 'error');
                }
            }
        });
    };

    if (isRoleLoading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <span className="loading loading-infinity loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                
                <div className="px-8 pb-10">
                    {/* Profile Image & Role */}
                    <div className="relative -mt-16 flex flex-col items-center">
                        <div className="avatar">
                            <div className="w-32 h-32 rounded-full ring-8 ring-white shadow-xl bg-gray-100">
                                <img src={user?.photoURL || 'https://i.ibb.co/0Qp9Y9G/user.png'} alt="Profile" />
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <h2 className="text-3xl font-black text-gray-900 flex items-center justify-center gap-2">
                                {user?.displayName || 'User Name'}
                                {isPremium && <FaCrown className="text-yellow-500 animate-bounce" title="Premium" />}
                            </h2>
                            <div className="mt-2 inline-flex items-center px-4 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-black text-xs uppercase tracking-widest">
                                {role || 'Citizen'}
                            </div>
                        </div>
                    </div>

                    {/* Blocked Alert */}
                    {isBlocked && (
                        <div className='mt-8 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl flex items-center justify-center animate-pulse'>
                            <FaExclamationTriangle className="mr-3 text-xl" />
                            <span className="font-black">ACCOUNT BLOCKED! CONTACT AUTHORITIES</span>
                        </div>
                    )}

                    {/* Update Form - Fixed Spacing */}
                    <form onSubmit={handleSubmit(handleProfileUpdate)} className="mt-10 space-y-8">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-black text-gray-700 uppercase tracking-wide text-xs">Full Name</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                    <FaUser />
                                </span>
                                <input 
                                    type="text" 
                                    {...register('displayName', { required: true })} 
                                    className="input input-bordered w-full h-14 pl-12 bg-gray-50 text-gray-900 font-bold focus:ring-4 focus:ring-blue-100 border-gray-200" 
                                />
                            </div>
                            {errors.displayName && <span className="text-red-500 text-xs mt-2 font-bold italic">Full name is required</span>}
                        </div>

                        <div className="form-control w-full opacity-70">
                            <label className="label">
                                <span className="label-text font-black text-gray-700 uppercase tracking-wide text-xs">Email (Read-Only)</span>
                            </label>
                            <input 
                                type="email" 
                                {...register('email')} 
                                className="input input-bordered w-full h-14 bg-gray-200 text-gray-600 font-bold cursor-not-allowed" 
                                readOnly 
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-full h-14 text-white font-black text-lg border-none bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100" disabled={isBlocked}>
                            SAVE PROFILE CHANGES
                        </button>
                    </form>
                    
                    <div className="divider my-12 text-gray-400 font-black text-xs uppercase tracking-widest">Membership Status</div>

                    {/* Premium Card - Fixed Contrast */}
                    {isPremium ? (
                        <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-200 flex items-center gap-4">
                            <div className="p-3 bg-green-500 rounded-full text-white">
                                <FaCheckCircle size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-green-900 text-lg">Active Premium Access</h4>
                                <p className="text-green-700 font-bold text-sm">You have unlimited reporting and priority support.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 bg-amber-50 rounded-2xl border-2 border-amber-100 text-center">
                            <p className="mb-6 text-amber-900 font-black text-lg tracking-tight">Upgrade to Premium for unlimited reporting and exclusive features.</p>
                            <button 
                                onClick={handleSubscription} 
                                className="btn btn-warning w-full h-14 text-black font-black text-lg border-none shadow-lg shadow-amber-200 hover:scale-[1.02] transition-transform" 
                                disabled={isBlocked}
                            >
                                GET PREMIUM NOW (1000 TK)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;