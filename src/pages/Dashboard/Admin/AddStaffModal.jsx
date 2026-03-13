import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  FaTimes,
  FaUserTie,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaImage,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const AddStaffModal = ({ onClose, refetchStaff, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const axiosSecure = useAxiosSecure();
  const [mutError, setMutError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [preview, setPreview] = useState(null);

  const addStaffMutation = useMutation({
    mutationFn: (staffData) =>
      axiosSecure.post("/dashboard/admin/staff", staffData),
    onSuccess: () => {
      refetchStaff();
      onSuccess?.("New staff member added successfully!");
      onClose();
    },
    onError: (error) => {
      const message =
        error.response?.status === 409
          ? error.response.data.message
          : "Failed to add staff. Please try again.";
      setMutError(message);
    },
  });

  const handleFormSubmit = async (data) => {
    setMutError("");
    let photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=1e3a5f&color=60a5fa&size=150`;

    const imageFile = data.image?.[0];
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
          formData,
        );
        photoURL = imgRes.data.data.url;
      } catch {
        setMutError("Image upload failed. Submitting with default avatar.");
      }
    }

    addStaffMutation.mutate({
      email: data.email,
      password: data.password,
      displayName: data.name,
      phone: data.phone,
      photoURL,
    });
  };

  const inputClass = (hasError) =>
    `w-full h-11 bg-slate-800/60 border rounded-xl px-4 text-white placeholder-slate-600 text-sm font-medium focus:outline-none transition-all ${
      hasError
        ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
        : "border-slate-700/60 hover:border-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
    }`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-slate-900 border border-slate-700/60 rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <FaUserTie className="text-emerald-400 text-sm" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Add New Staff</h3>
              <p className="text-slate-500 text-[10px]">
                Creates account in DB + Firebase Auth
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          className="p-6 space-y-4"
        >
          {mutError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs font-medium">
              {mutError}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-xs" />
              <input
                type="text"
                placeholder="John Doe"
                {...register("name", { required: "Name is required." })}
                className={`${inputClass(errors.name)} pl-10`}
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-[11px] font-medium mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Email *
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-xs" />
              <input
                type="email"
                placeholder="staff@citycare.gov"
                {...register("email", { required: "Email is required." })}
                className={`${inputClass(errors.email)} pl-10`}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-[11px] font-medium mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Password *
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-xs" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Min. 6 characters"
                {...register("password", {
                  required: "Password is required.",
                  minLength: { value: 6, message: "Min 6 characters." },
                })}
                className={`${inputClass(errors.password)} pl-10 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
              >
                {showPass ? (
                  <FaEyeSlash className="text-xs" />
                ) : (
                  <FaEye className="text-xs" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-[11px] font-medium mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Phone (Optional)
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-xs" />
              <input
                type="text"
                placeholder="+880 1XXX-XXXXXX"
                {...register("phone")}
                className={`${inputClass(false)} pl-10`}
              />
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Staff Photo (Optional)
            </label>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaImage className="text-slate-600 text-sm" />
                )}
              </div>
              <label className="flex-1 flex items-center gap-2 h-11 bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 rounded-xl px-3.5 cursor-pointer transition-all">
                <FaImage className="text-slate-600 text-xs" />
                <span className="text-slate-500 text-xs truncate">
                  Choose photo...
                </span>
                <input
                  type="file"
                  {...register("image")}
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) setPreview(URL.createObjectURL(f));
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || addStaffMutation.isPending}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || addStaffMutation.isPending}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting || addStaffMutation.isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FaUserTie />
              )}
              Create Staff Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;
