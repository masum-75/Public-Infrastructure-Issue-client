// ─── EditIssueModal.jsx ────────────────────────────────────────────────────────
// Save this as a separate file: EditIssueModal.jsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaTimes, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";

const CATEGORIES = [
  "Pothole",
  "Streetlight",
  "Water Leakage",
  "Garbage Overflow",
  "Damaged Footpath",
];

export const EditIssueModal = ({ issue, onClose, refetch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: issue });
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [mutError, setMutError] = useState("");

  const editMutation = useMutation({
    mutationFn: ({ id, updatedData }) =>
      axiosSecure.patch(`/dashboard/my-issues/${id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myIssues"] });
      queryClient.invalidateQueries({ queryKey: ["issues", issue._id] });
      refetch?.();
      onClose();
    },
    onError: () =>
      setMutError("Failed to update. Only Pending issues can be modified."),
  });

  const handleFormSubmit = async (data) => {
    setMutError("");
    let imageUrl = issue.imageUrl;
    const imageFile = data.image?.[0];
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
          formData,
        );
        imageUrl = imgRes.data.data.url;
      } catch {
        setMutError("Image upload failed. Using old photo.");
      }
    }
    editMutation.mutate({
      id: issue._id,
      updatedData: {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        imageUrl,
      },
    });
  };

  const inputClass = (hasError) =>
    `w-full bg-slate-800/60 border rounded-xl px-4 text-white placeholder-slate-600 text-sm font-medium focus:outline-none transition-all ${
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
      <div className="relative bg-slate-900 border border-slate-700/60 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-800/60">
          <div>
            <h3 className="text-lg font-black text-white">Edit Issue</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Only Pending issues can be modified
            </p>
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
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs font-medium">
              {mutError}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Title *
            </label>
            <input
              type="text"
              {...register("title", { required: true, minLength: 5 })}
              className={`${inputClass(errors.title)} h-11`}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Category *
            </label>
            <select
              {...register("category", { required: true })}
              className={`${inputClass(errors.category)} h-11 appearance-none cursor-pointer`}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Location *
            </label>
            <input
              type="text"
              {...register("location", { required: true })}
              className={`${inputClass(errors.location)} h-11`}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Description *
            </label>
            <textarea
              {...register("description", { required: true, minLength: 20 })}
              rows={4}
              className={`${inputClass(errors.description)} py-3 resize-none`}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              New Photo (optional)
            </label>
            <label className="flex items-center gap-3 h-11 bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 rounded-xl px-4 cursor-pointer transition-all">
              <FaCloudUploadAlt className="text-slate-500 text-sm" />
              <span className="text-slate-500 text-xs">
                Leave blank to keep existing photo
              </span>
              <input
                type="file"
                {...register("image")}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || editMutation.isPending}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-xl transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || editMutation.isPending}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              {isSubmitting || editMutation.isPending ? (
                <span className="w-4 h-4 border-2 border-slate-700 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <FaCheckCircle />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIssueModal;
