import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQueryClient } from '@tanstack/react-query';
import {
    FaCrown, FaCheckCircle, FaExclamationTriangle,
    FaUser, FaEnvelope, FaShieldAlt, FaBolt
} from 'react-icons/fa';

const Toast = ({ message, type, onClose }) => (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl text-sm font-bold transition-all ${type === 'error'
        ? 'bg-red-900/95 border-red-700/60 text-red-200'
        : 'bg-emerald-900/95 border-emerald-700/60 text-emerald-200'
        }`}>
        {type === 'error' ? <FaExclamationTriangle /> : <FaCheckCircle />}
        {message}
    </div>
);

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const { role, isPremium, isBlocked, isRoleLoading } = useRole();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: { displayName: user?.displayName || '', email: user?.email || '' }
    });
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [toast, setToast] = useState(null);
    const [subscribeLoading, setSubscribeLoading] = useState(false);
    const [showSubConfirm, setShowSubConfirm] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2800);
    };

    const handleProfileUpdate = async (data) => {
        try {
            await updateUserProfile({ displayName: data.displayName });
            queryClient.invalidateQueries({ queryKey: [user?.email, 'userRole'] });
            showToast('Profile updated successfully!');
        } catch (error) {
            showToast(error.message || 'Update failed.', 'error');
        }
    };

    const handleSubscription = async () => {
        setShowSubConfirm(false);
        setSubscribeLoading(true);
        try {
            const res = await axiosSecure.post('/subscription-checkout-session', { cost: 1000 });
            window.location.href = res.data.url;
        } catch {
            showToast('Payment initiation failed. Try again.', 'error');
            setSubscribeLoading(false);
        }
    };

    if (isRoleLoading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            {toast && <Toast message={toast.message} type={toast.type} />}

            {/* Subscribe confirm dialog */}
            {showSubConfirm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowSubConfirm(false)} />
                    <div className="relative bg-slate-900 border border-slate-700/60 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
                        <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <FaCrown className="text-amber-400 text-2xl" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">Confirm Premium?</h3>
                        <p className="text-slate-400 text-sm mb-7">You'll be charged <span className="text-white font-bold">1,000 Taka</span> for full Premium access.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowSubConfirm(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all">Cancel</button>
                            <button onClick={handleSubscription} className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-sm transition-all">Pay Now</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800/60 rounded-3xl overflow-hidden">

                {/* Cover + Avatar */}
                <div className="h-32 bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-slate-900 relative">
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
                </div>

                <div className="px-8 pb-10">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-14 mb-8">
                        <div className="relative w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-slate-900 border-2 border-slate-800 shrink-0 bg-slate-800">
                            <img
                                src={user?.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.displayName || 'U') + '&background=1e3a5f&color=60a5fa&size=128'}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                            {isPremium && (
                                <div className="absolute bottom-1.5 right-1.5 w-6 h-6 bg-amber-400 rounded-lg flex items-center justify-center">
                                    <FaCrown className="text-amber-900 text-[10px]" />
                                </div>
                            )}
                        </div>
                        <div className="pb-1">
                            <h2 className="text-2xl font-black text-white flex items-center gap-2 flex-wrap">
                                {user?.displayName || 'User Name'}
                                {isPremium && <span className="text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/25 px-2.5 py-1 rounded-full">Premium</span>}
                            </h2>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                                    {role || 'Citizen'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Blocked Warning */}
                    {isBlocked && (
                        <div className="mb-8 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl">
                            <FaExclamationTriangle className="text-red-400 text-lg shrink-0" />
                            <div>
                                <p className="text-red-300 font-black text-sm">Account Restricted</p>
                                <p className="text-red-400/70 text-xs font-medium">Contact authorities to restore access.</p>
                            </div>
                        </div>
                    )}

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-5 mb-10">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm" />
                                <input
                                    type="text"
                                    {...register('displayName', { required: 'Full name is required.' })}
                                    placeholder="Your full name"
                                    className={`w-full h-12 bg-slate-800/60 border rounded-xl pl-11 pr-5 text-white placeholder-slate-600 text-sm font-medium focus:outline-none transition-all ${errors.displayName
                                        ? 'border-red-500/60 focus:ring-2 focus:ring-red-500/20'
                                        : 'border-slate-700/60 hover:border-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20'
                                        }`}
                                />
                            </div>
                            {errors.displayName && <p className="text-red-400 text-xs font-medium mt-1.5">{errors.displayName.message}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Email Address <span className="text-slate-700">(Read-Only)</span>
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 text-sm" />
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    readOnly
                                    className="w-full h-12 bg-slate-800/30 border border-slate-800 rounded-xl pl-11 pr-5 text-slate-600 text-sm font-medium cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || isBlocked}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center justify-center gap-2"
                        >
                            {isSubmitting
                                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                                : 'Save Profile Changes'
                            }
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-slate-800" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                            <FaShieldAlt className="text-[9px]" /> Membership Status
                        </span>
                        <div className="flex-1 h-px bg-slate-800" />
                    </div>

                    {/* Premium Status */}
                    {isPremium ? (
                        <div className="flex items-center gap-4 p-5 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl">
                            <div className="w-12 h-12 bg-emerald-500/15 rounded-xl flex items-center justify-center shrink-0">
                                <FaCheckCircle className="text-emerald-400 text-xl" />
                            </div>
                            <div>
                                <h4 className="font-black text-white text-base">Premium Active</h4>
                                <p className="text-emerald-400/80 text-sm font-medium">Unlimited reporting and priority support enabled.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 bg-amber-500/5 border border-amber-500/15 rounded-2xl text-center">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FaCrown className="text-amber-400 text-xl" />
                            </div>
                            <h4 className="text-white font-black text-lg mb-2">Upgrade to Premium</h4>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
                                Get unlimited reporting, priority boost, and exclusive analytics for just 1,000 Taka.
                            </p>
                            <button
                                onClick={() => setShowSubConfirm(true)}
                                disabled={isBlocked || subscribeLoading}
                                className="flex items-center justify-center gap-2 mx-auto px-8 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 font-black rounded-xl transition-all shadow-lg shadow-amber-500/15 hover:-translate-y-0.5 text-sm"
                            >
                                {subscribeLoading
                                    ? <span className="w-4 h-4 border-2 border-slate-600 border-t-slate-900 rounded-full animate-spin" />
                                    : <FaBolt />
                                }
                                Get Premium — 1,000 Taka
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;