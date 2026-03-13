import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";

const DEMO_CREDENTIALS = [
  {
    label: "Demo Citizen",
    email: "citizen@citycare.com",
    password: "citizen123",
  },
  {
    label: "Demo Admin",
    email: "tanbirmasum014@gmail.com",
    password: "admin123",
  },
];

const Login = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const { signIn, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async (data) => {
    setAuthError("");
    try {
      await signIn(data.email, data.password);
      navigate(from, { replace: true });
    } catch (error) {
      const msg =
        error.code === "auth/invalid-credential"
          ? "Invalid email or password. Please try again."
          : error.message;
      setAuthError(msg);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError("");
    setGoogleLoading(true);
    try {
      await googleSignIn();
      navigate(from, { replace: true });
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const fillDemo = (cred) => {
    setValue("email", cred.email);
    setValue("password", cred.password);
  };

  const inputClass = (hasError) =>
    `w-full h-12 bg-slate-800/60 border rounded-xl px-5 text-white placeholder-slate-600 text-sm font-medium focus:outline-none transition-all duration-200 ${
      hasError
        ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
        : "border-slate-700/60 hover:border-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2.5 mb-10 group"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <MdOutlineReportProblem className="text-white text-xl" />
          </div>
          <span className="text-2xl font-black text-white">
            CITY<span className="text-blue-400">CARE</span>
          </span>
        </Link>

        <div className="bg-slate-900 border border-slate-800/60 rounded-3xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-white mb-1">
              Welcome back
            </h2>
            <p className="text-slate-400 text-sm">
              Sign in to your CityCare account
            </p>
          </div>

          {/* Demo credential buttons */}
          <div className="flex gap-2 mb-6">
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.label}
                type="button"
                onClick={() => fillDemo(cred)}
                className="flex-1 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-xl transition-all duration-200"
              >
                {cred.label}
              </button>
            ))}
          </div>

          {/* Auth error */}
          {authError && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <span className="text-red-400 mt-0.5 shrink-0">✕</span>
              <p className="text-red-300 text-sm font-medium">{authError}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", { required: "Email is required." })}
                  className={`${inputClass(errors.email)} pl-11`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs font-medium mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required.",
                  })}
                  className={`${inputClass(errors.password)} pl-11 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPass ? (
                    <FaEyeSlash className="text-sm" />
                  ) : (
                    <FaEye className="text-sm" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs font-medium mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              or
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full h-12 flex items-center justify-center gap-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-white font-bold rounded-xl transition-all duration-200 text-sm disabled:opacity-50"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
            ) : (
              <FaGoogle className="text-red-400" />
            )}
            Continue with Google
          </button>

          <p className="mt-7 text-center text-slate-500 text-sm">
            New to CityCare?{" "}
            <Link
              to="/register"
              className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
