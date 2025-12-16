import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useRole from "../../../hooks/useRole";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import axios from "axios";

const categories = [
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
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const { isPremium, isBlocked, roleLoading } = useRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleIssueReport = async (data) => {
    if (isBlocked) {
      Swal.fire(
        "Blocked!",
        "You are currently blocked and cannot report an issue. Contact authorities.",
        "error"
      );
      return;
    }

    const imageFile = data.image[0];
    if (!imageFile) {
      Swal.fire("Error", "Please upload an image.", "error");
      return;
    }

    let imageUrl = "";
    const image_API_URL = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_host_key
    }`;

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const imgRes = await axios.post(image_API_URL, formData);
      imageUrl = imgRes.data.data.url;

      const issueData = {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        imageUrl,
        citizenEmail: user.email,
        citizenName: user.displayName,
      };

      // 3. Send data to backend
      const res = await axiosSecure.post("/issues", issueData);

      if (res.data.insertedId) {
        Swal.fire(
          "Success",
          "Issue reported successfully! You can track its progress.",
          "success"
        );
        navigate("/dashboard/my-issues");
      }
    } catch (error) {
      let errorMessage = "Failed to report issue.";
      if (
        error.response?.status === 403 &&
        error.response.data?.message === "Free user issue limit reached."
      ) {
        errorMessage =
          "Free user limit reached! Please subscribe to report unlimited issues.";
      } else if (
        error.response?.status === 403 &&
        error.response.data?.message === "user is blocked"
      ) {
        errorMessage = "You are blocked and cannot submit issues.";
      }
      Swal.fire("Error", errorMessage, "error");
    }
  };

  if (roleLoading) {
    return (
      <span className="loading loading-infinity loading-xl block mx-auto mt-20"></span>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl">
      <h2 className="text-4xl font-bold mb-6 text-primary">
        Report a New Infrastructure Issue
      </h2>

      {/* Limit Warning for Free Users */}
      {!isPremium && (
        <div role="alert" className="alert alert-warning mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.503-1.66 1.733-3.093L12.733 4.907c-.77-.735-1.782-.735-2.552 0L4.205 16.907c-.77 1.433.193 3.093 1.733 3.093z"
            />
          </svg>
          <span>
            Free users can report a **maximum of 3 issues**. You must subscribe
            to Premium for unlimited reports.
          </span>
          <button
            onClick={() => navigate("/dashboard/profile")}
            className="btn btn-sm btn-warning"
          >
            Subscribe Now
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(handleIssueReport)} className="space-y-6">
        {/* Title */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">
              Issue Title (e.g., Broken Streetlight on Main St)
            </span>
          </div>
          <input
            type="text"
            {...register("title", { required: true, minLength: 5 })}
            className="input input-bordered w-full"
          />
          {errors.title && (
            <span className="text-red-500 text-sm mt-1">
              Title is required (min 5 characters)
            </span>
          )}
        </label>

        {/* Description */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">
              Detailed Description
            </span>
          </div>
          <textarea
            {...register("description", { required: true, minLength: 20 })}
            className="textarea textarea-bordered h-24"
            placeholder="Describe the issue, its severity, and exact location details."
          ></textarea>
          {errors.description && (
            <span className="text-red-500 text-sm mt-1">
              Description is required (min 20 characters)
            </span>
          )}
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Dropdown */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-semibold">Issue Category</span>
            </div>
            <select
              {...register("category", { required: true })}
              className="select select-bordered"
            >
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-red-500 text-sm mt-1">
                Category is required
              </span>
            )}
          </label>

          {/* Location */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-semibold">
                Location (Address or Landmark)
              </span>
            </div>
            <input
              type="text"
              {...register("location", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.location && (
              <span className="text-red-500 text-sm mt-1">
                Location is required
              </span>
            )}
          </label>
        </div>

        {/* Image Upload */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">
              Upload Photo (Proof)
            </span>
          </div>
          <input
            type="file"
            {...register("image", { required: true })}
            accept="image/*"
            className="file-input file-input-bordered w-full"
          />
          {errors.image && (
            <span className="text-red-500 text-sm mt-1">Photo is required</span>
          )}
        </label>

        <button type="submit" className="btn btn-primary w-full text-black">
          Submit Issue Report
        </button>
      </form>
    </div>
  );
};

export default ReportIssue;
