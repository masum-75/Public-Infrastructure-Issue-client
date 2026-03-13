import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useRole from "../../../hooks/useRole";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  FaCloudUploadAlt,
  FaExclamationCircle,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaImage,
} from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";

const CATEGORIES = [
  "Pothole",
  "Streetlight",
  "Water Leakage",
  "Garbage Overflow",
  "Damaged Footpath",
];

const ReportIssue = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const { user } = useAuth();
  const { isPremium, isBlocked, roleLoading } = useRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleIssueReport = async (data) => {
    if (isBlocked) {
      setSubmitError("Your account is restricted. Contact support.");
      return;
    }
    setSubmitError("");
    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);
      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
        formData,
      );
      if (!imgRes.data.success) throw new Error("Image upload failed.");

      const issueData = {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        imageUrl: imgRes.data.data.url,
        citizenEmail: user?.email,
        citizenName: user?.displayName,
        status: "Pending",
        createdAt: new Date(),
      };

      const res = await axiosSecure.post("/issues", issueData);
      if (res.data.insertedId) {
        setSuccess(true);
        reset();
        setPreview(null);
        setTimeout(() => navigate("/dashboard/my-issues"), 2000);
      }
    } catch (error) {
      const serverMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit. Try again.";
      setSubmitError(serverMsg);
    }
  };

  if (roleLoading)
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );

  const inputClass = (hasError) =>
    `w-full bg-slate-800/60 border rounded-xl px-5 text-white placeholder-slate-600 text-sm font-medium focus:outline-none transition-all duration-200 ${
      hasError
        ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
        : "border-slate-700/60 hover:border-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
    }`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Report New Issue</h2>
          <p className="text-slate-500 text-sm mt-1">
            Provide details about the infrastructure problem
          </p>
        </div>
        {!isPremium && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl self-start">
            <FaExclamationCircle className="text-amber-400 text-sm" />
            <span className="text-amber-300 font-bold text-xs">
              3 Reports Limit (Free)
            </span>
          </div>
        )}
      </header>

      {/* Success message */}
      {success && (
        <div className="flex items-center gap-3 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <FaCheckCircle className="text-emerald-400 text-xl shrink-0" />
          <div>
            <p className="text-emerald-300 font-bold">
              Issue reported successfully!
            </p>
            <p className="text-emerald-400/60 text-xs">
              Redirecting to your reports...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {submitError && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <FaExclamationCircle className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-red-300 text-sm font-medium">{submitError}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-8">
        <form
          onSubmit={handleSubmit(handleIssueReport)}
          noValidate
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Issue Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Broken Streetlight on Main Road"
              {...register("title", {
                required: "Title is required.",
                minLength: { value: 5, message: "Min 5 characters." },
              })}
              className={`${inputClass(errors.title)} h-12`}
            />
            {errors.title && (
              <p className="text-red-400 text-xs font-medium mt-1.5">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category + Location row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category", { required: "Category is required." })}
                className={`${inputClass(errors.category)} h-12 appearance-none cursor-pointer`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                }}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-xs font-medium mt-1.5">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Exact Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm" />
                <input
                  type="text"
                  placeholder="Street name, area, city"
                  {...register("location", {
                    required: "Location is required.",
                  })}
                  className={`${inputClass(errors.location)} h-12 pl-11`}
                />
              </div>
              {errors.location && (
                <p className="text-red-400 text-xs font-medium mt-1.5">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe the issue in detail — what you saw, when it occurred, potential hazards..."
              {...register("description", {
                required: "Description is required.",
                minLength: {
                  value: 20,
                  message: "Min 20 characters required.",
                },
              })}
              rows={5}
              className={`${inputClass(errors.description)} py-4 resize-none`}
            />
            {errors.description && (
              <p className="text-red-400 text-xs font-medium mt-1.5">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Attach Photo <span className="text-red-500">*</span>
            </label>
            <label
              className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
                errors.image
                  ? "border-red-500/50 bg-red-500/5"
                  : "border-slate-700/60 hover:border-blue-500/40 bg-slate-800/30 hover:bg-blue-500/5"
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-52 object-cover rounded-xl"
                />
              ) : (
                <>
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                    <FaCloudUploadAlt className="text-slate-500 text-2xl" />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-sm font-medium">
                      Click to upload a photo
                    </p>
                    <p className="text-slate-600 text-xs mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </>
              )}
              <input
                type="file"
                {...register("image", { required: "A photo is required." })}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setPreview(URL.createObjectURL(file));
                }}
                className="hidden"
              />
            </label>
            {errors.image && (
              <p className="text-red-400 text-xs font-medium mt-1.5">
                {errors.image.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isBlocked}
            className="w-full h-13 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 text-sm"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Uploading & Submitting...
              </>
            ) : (
              <>
                <MdOutlineReportProblem className="text-lg" /> Submit Official
                Report
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
