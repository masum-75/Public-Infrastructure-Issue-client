import React, { useState } from "react";
import {
  FaPaperPlane,
  FaEnvelopeOpenText,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubscribed(true);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-slate-900 border border-blue-500/20 p-10 md:p-16">
      {/* Background decorations */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-14 h-14 bg-blue-500/15 border border-blue-500/25 rounded-2xl flex items-center justify-center mb-6">
          <FaEnvelopeOpenText className="text-blue-400 text-2xl" />
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
          Stay in the <span className="text-blue-400">Loop</span>
        </h2>

        <p className="text-slate-400 mb-10 max-w-md leading-relaxed">
          Join <span className="text-white font-bold">5,000+ citizens</span>{" "}
          getting real-time updates on community resolutions, new features, and
          city improvements.
        </p>

        {subscribed ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-emerald-400 text-3xl" />
            </div>
            <p className="text-xl font-bold text-white">You're subscribed!</p>
            <p className="text-slate-400 text-sm">
              Thank you for joining the CityCare community. Check your inbox
              shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            noValidate
            className="w-full max-w-lg space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your email address"
                  className={`w-full h-12 bg-slate-900/80 backdrop-blur-sm border rounded-xl px-5 text-white placeholder-slate-600 focus:outline-none transition-all duration-200 text-sm ${
                    error
                      ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-700/60 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-slate-600"
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="h-12 px-7 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap text-sm"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FaPaperPlane className="text-xs" />
                    Subscribe
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-xs font-medium text-left">
                {error}
              </p>
            )}
          </form>
        )}

        <div className="flex items-center gap-2 mt-6 text-slate-600 text-xs font-medium">
          <FaLock className="text-[10px]" />
          No spam. Unsubscribe anytime. We respect your privacy.
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
