import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { FaGoogle, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaImage } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { MdOutlineReportProblem } from "react-icons/md";

const Register = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { createUser, updateUserProfile, googleSignIn } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const [showPass, setShowPass] = useState(false);
    const [authError, setAuthError] = useState("");
    const [googleLoading, setGoogleLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const onSubmit = async (data) => {
        setAuthError("");
        try {
            let photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=1e3a5f&color=60a5fa&size=128`;

            if (data.image?.[0]) {
                const formData = new FormData();
                formData.append("image", data.image[0]);
                const imgRes = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
                    formData
                );
                if (imgRes.data.success) photoURL = imgRes.data.data.url;
            }

            await createUser(data.email, data.password);
            await updateUserProfile(data.name, photoURL);

            const userInfo = {
                name: data.name,
                email: data.email.toLowerCase(),
                photoURL,
                role: "citizen",
                createdAt: new Date(),
            };

            const dbRes = await axiosSecure.post("/users", userInfo);
            if (dbRes.data.insertedId || dbRes.data.message === "User already registered") {
                navigate("/");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            setAuthError(errorMsg);
        }
    };

    const handleGoogleLogin = async () => {
        setAuthError("");
        setGoogleLoading(true);
        try {
            const result = await googleSignIn();
            const user = result.user;
            await axiosSecure.post("/users", {
                name: user?.displayName,
                email: user?.email?.toLowerCase(),
                photoURL: user?.photoURL,
                role: "citizen",
                createdAt: new Date(),
            });
            navigate("/");
        } catch (err) {
            setAuthError(err.message);
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleImagePreview = (e) => {
        const file = e.target.files[0];
        if (file) setPreviewUrl(URL.createObjectURL(file));
    };

    const inputClass = (hasError) =>
        `w-full h-12 bg-slate-800/60 border rounded-xl px-5 text-white placeholder-slate-600 text-sm font-medium focus:outline-none transition-all duration-200 ${hasError
            ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
            : "border-slate-700/60 hover:border-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
        }`;

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-16 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2.5 mb-10 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MdOutlineReportProblem className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-black text-white">CITY<span className="text-blue-400">CARE</span></span>
                </Link>

                <div className="bg-slate-900 border border-slate-800/60 rounded-3xl p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-white mb-1">Create your account</h2>
                        <p className="text-slate-400 text-sm">Join thousands of citizens improving their community</p>
                    </div>

                    {/* Auth error */}
                    {authError && (
                        <div className="mb-5 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                            <p className="text-red-300 text-sm font-medium">{authError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    {...register("name", { required: "Full name is required." })}
                                    className={`${inputClass(errors.name)} pl-11`}
                                />
                            </div>
                            {errors.name && <p className="text-red-400 text-xs font-medium mt-1.5">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register("email", {
                                        required: "Email is required.",
                                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email." }
                                    })}
                                    className={`${inputClass(errors.email)} pl-11`}
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs font-medium mt-1.5">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm" />
                                <input
                                    type={showPass ? "text" : "password"}
                                    placeholder="Min. 6 characters"
                                    {...register("password", {
                                        required: "Password is required.",
                                        minLength: { value: 6, message: "Minimum 6 characters required." }
                                    })}
                                    className={`${inputClass(errors.password)} pl-11 pr-11`}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                                    {showPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-xs font-medium mt-1.5">{errors.password.message}</p>}
                        </div>

                        {/* Profile Photo */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Profile Photo <span className="text-slate-700">(Optional)</span>
                            </label>
                            <div className="flex items-center gap-4">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-xl object-cover border-2 border-slate-700 shrink-0" />
                                ) : (
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0">
                                        <FaImage className="text-slate-600" />
                                    </div>
                                )}
                                <label className="flex-1 flex items-center gap-3 h-12 bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 rounded-xl px-4 cursor-pointer transition-all group">
                                    <FaImage className="text-slate-600 text-sm" />
                                    <span className="text-slate-500 text-sm group-hover:text-slate-400 truncate">Choose a file...</span>
                                    <input
                                        type="file"
                                        {...register("image")}
                                        accept="image/*"
                                        onChange={handleImagePreview}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm mt-2"
                        >
                            {isSubmitting
                                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account...</>
                                : "Create Account"
                            }
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-800" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">or</span>
                        <div className="flex-1 h-px bg-slate-800" />
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full h-12 flex items-center justify-center gap-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-white font-bold rounded-xl transition-all duration-200 text-sm disabled:opacity-50"
                    >
                        {googleLoading
                            ? <span className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                            : <FaGoogle className="text-red-400" />
                        }
                        Continue with Google
                    </button>

                    <p className="mt-7 text-center text-slate-500 text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;