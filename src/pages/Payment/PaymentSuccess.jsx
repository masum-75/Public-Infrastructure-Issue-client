import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { FaCheckCircle, FaTimesCircle, FaCrown, FaArrowRight } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const STEPS = ['Connecting to server', 'Verifying session', 'Updating account', 'Done!'];

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const sessionId = new URLSearchParams(location.search).get('session_id');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(0);
    const [countdown, setCountdown] = useState(4);

    // Step ticker (visual only, while loading)
    useEffect(() => {
        if (!loading) return;
        const t = setInterval(() => setStep(prev => Math.min(prev + 1, STEPS.length - 2)), 900);
        return () => clearInterval(t);
    }, [loading]);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setError('Invalid session. Payment could not be verified.');
                setLoading(false);
                setTimeout(() => navigate('/dashboard/profile'), 3500);
                return;
            }
            try {
                const res = await axiosSecure.patch(`/payment-success?session_id=${sessionId}`);
                if (res.data.success) {
                    setStep(STEPS.length - 1);
                    setSuccess(true);
                }
            } catch (err) {
                console.error('Verification Error:', err);
                setError(err.response?.data?.message || 'Failed to verify payment. Please contact support.');
            } finally {
                setLoading(false);
                setTimeout(() => navigate('/dashboard/profile'), 4000);
            }
        };
        verifyPayment();
    }, [sessionId, navigate, axiosSecure]);

    // Countdown after verification complete
    useEffect(() => {
        if (loading) return;
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) { clearInterval(interval); }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [loading]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${success ? 'bg-emerald-600/5' : error ? 'bg-red-600/5' : 'bg-blue-600/5'}`} />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-slate-800/40 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 text-center max-w-md w-full">

                {/* ── Loading state ── */}
                {loading && (
                    <>
                        {/* Spinner */}
                        <div className="relative inline-flex mb-8">
                            <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center border border-blue-500/20">
                                <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-400 rounded-full animate-spin" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-black text-white mb-2">Verifying Your Payment</h1>
                        <p className="text-slate-500 text-sm mb-10">Please don't close or refresh this page.</p>

                        {/* Step progress */}
                        <div className="text-left space-y-3">
                            {STEPS.map((s, i) => (
                                <div key={s} className={`flex items-center gap-3 transition-all duration-300 ${i <= step ? 'opacity-100' : 'opacity-25'}`}>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${i < step
                                        ? 'bg-emerald-500'
                                        : i === step
                                            ? 'bg-blue-500/20 border-2 border-blue-400'
                                            : 'bg-slate-800 border border-slate-700'
                                        }`}>
                                        {i < step
                                            ? <span className="text-white text-[8px] font-black">✓</span>
                                            : i === step
                                                ? <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                                : null
                                        }
                                    </div>
                                    <span className={`text-sm font-semibold ${i <= step ? 'text-white' : 'text-slate-600'}`}>{s}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* ── Success state ── */}
                {!loading && success && (
                    <>
                        <div className="relative inline-flex mb-8">
                            <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20">
                                <FaCheckCircle className="text-emerald-400 text-4xl" />
                            </div>
                            <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl animate-ping" style={{ animationDuration: '2s' }} />
                        </div>

                        <h1 className="text-3xl font-black text-white mb-3">Payment Successful!</h1>
                        <p className="text-slate-400 text-base mb-3 leading-relaxed">
                            Your account has been upgraded to <span className="text-amber-300 font-bold">Premium</span>. Enjoy unlimited reporting and priority support!
                        </p>

                        {/* Premium badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-8">
                            <FaCrown className="text-amber-400" />
                            <span className="text-amber-300 font-bold text-sm">Premium Access Activated</span>
                        </div>

                        {/* Countdown */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-slate-800/60 rounded-2xl">
                                <div className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center">
                                    <span className="text-white font-black text-sm tabular-nums">{Math.max(countdown, 0)}</span>
                                </div>
                                <span className="text-slate-500 text-sm font-medium">Redirecting to profile...</span>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-1 bg-slate-800 rounded-full mb-8 overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-linear"
                                style={{ width: `${(Math.max(countdown, 0) / 4) * 100}%` }}
                            />
                        </div>

                        <Link
                            to="/dashboard/profile"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 text-sm"
                        >
                            View Profile <FaArrowRight className="text-xs" />
                        </Link>
                    </>
                )}

                {/* ── Error state ── */}
                {!loading && !success && (
                    <>
                        <div className="relative inline-flex mb-8">
                            <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20">
                                <FaTimesCircle className="text-red-400 text-4xl" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-black text-white mb-3">Verification Failed</h1>
                        <p className="text-slate-400 text-base mb-3 leading-relaxed">{error}</p>

                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-slate-800/60 rounded-2xl">
                                <div className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center">
                                    <span className="text-white font-black text-sm tabular-nums">{Math.max(countdown, 0)}</span>
                                </div>
                                <span className="text-slate-500 text-sm font-medium">Redirecting to profile...</span>
                            </div>
                        </div>

                        <div className="w-full h-1 bg-slate-800 rounded-full mb-8 overflow-hidden">
                            <div
                                className="h-full bg-red-500/60 rounded-full transition-all duration-1000 ease-linear"
                                style={{ width: `${(Math.max(countdown, 0) / 4) * 100}%` }}
                            />
                        </div>

                        <Link
                            to="/dashboard/profile"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold rounded-xl transition-all text-sm"
                        >
                            Back to Profile
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;