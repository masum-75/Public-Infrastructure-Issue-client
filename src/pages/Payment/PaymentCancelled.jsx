import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { FaTimesCircle, FaArrowLeft, FaCreditCard } from "react-icons/fa";

const PaymentCancelled = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/dashboard/profile");
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-slate-800/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Icon */}
        <div className="relative inline-flex mb-8">
          <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20">
            <FaTimesCircle className="text-red-400 text-4xl" />
          </div>
          <div className="absolute inset-0 bg-red-500/5 rounded-3xl animate-ping" />
        </div>

        <h1 className="text-3xl font-black text-white mb-3">
          Payment Cancelled
        </h1>
        <p className="text-slate-400 text-base mb-2 leading-relaxed">
          Your transaction was not completed. No charges were made to your
          account.
        </p>

        {/* Countdown */}
        <div className="flex items-center justify-center gap-2 my-8">
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-slate-800/60 rounded-2xl">
            <div className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center">
              <span className="text-white font-black text-sm tabular-nums">
                {countdown}
              </span>
            </div>
            <span className="text-slate-500 text-sm font-medium">
              Redirecting to profile...
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-800 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-red-500/60 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 5) * 100}%` }}
          />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard/profile"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 text-sm"
          >
            <FaCreditCard /> Try Again
          </Link>
          <Link
            to="/dashboard/citizen-home"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold rounded-xl transition-all text-sm"
          >
            <FaArrowLeft className="text-xs" /> Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
