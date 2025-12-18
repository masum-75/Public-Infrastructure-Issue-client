import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useRole from "../../../hooks/useRole";
import Swal from "sweetalert2";
import { useNavigate } from "react-router"; 
import axios from "axios";
import { FaCloudUploadAlt, FaExclamationCircle } from "react-icons/fa";

const categories = ["Pothole", "Streetlight", "Water Leakage", "Garbage Overflow", "Damaged Footpath"];

const ReportIssue = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user } = useAuth();
  const { isPremium, isBlocked, roleLoading } = useRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleIssueReport = async (data) => {
    if (isBlocked) {
      return Swal.fire("Blocked!", "You are currently blocked.", "error");
    }

    try {
      Swal.fire({ title: 'Processing...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      const formData = new FormData();
      formData.append("image", data.image[0]);
      const imgRes = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`, formData);
      
      if (!imgRes.data.success) throw new Error("Image upload failed");
      const imageUrl = imgRes.data.data.url;

      const issueData = {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        imageUrl,
        citizenEmail: user?.email,
        citizenName: user?.displayName,
        status: "Pending",
        createdAt: new Date()
      };

      const res = await axiosSecure.post("/issues", issueData);

      if (res.data.insertedId) {
        Swal.fire("Success", "Issue reported successfully!", "success");
        navigate("/dashboard/my-issues");
      }
    } catch (error) {
     console.log("Error Status:", error.response?.status); 
    console.log("Error Response Data:", error.response?.data); 
    
    const serverMsg = error.response?.data?.message || "Failed to connect to server.";
    Swal.fire("Error", serverMsg, "error");
    }
  };

  if (roleLoading) return <div className="flex justify-center mt-20"><span className="loading loading-infinity loading-lg text-primary"></span></div>;

  return (
    <div className="max-w-4xl mx-auto my-10 p-4">
      <div className="card bg-white shadow-2xl border border-gray-200"> 
        <div className="card-body p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-primary">Report New Issue</h2>
              <p className="text-gray-600 mt-1">Provide details about the infrastructure problem</p>
            </div>
            {!isPremium && (
              <div className="badge badge-warning p-4 gap-2 font-bold text-black">
                <FaExclamationCircle /> 3 Reports Limit
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(handleIssueReport)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
             
              <div className="form-control w-full md:col-span-2">
                <label className="label font-bold text-gray-700">Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. Broken Streetlight"
                  {...register("title", { required: true, minLength: 5 })}
                  className="input input-bordered w-full text-black bg-gray-50 focus:bg-white" 
                />
                {errors.title && <span className="text-red-500 text-xs mt-1">Min 5 characters required</span>}
              </div>

              {/* Category */}
              <div className="form-control w-full">
                <label className="label font-bold text-gray-700">Category</label>
                <select 
                  {...register("category", { required: true })} 
                  className="select select-bordered w-full text-black bg-gray-50"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              {/* Location */}
              <div className="form-control w-full">
                <label className="label font-bold text-gray-700">Exact Location</label>
                <input
                  type="text"
                  placeholder="Street, City"
                  {...register("location", { required: true })}
                  className="input input-bordered w-full text-black bg-gray-50"
                />
              </div>

              {/* Description */}
              <div className="form-control w-full md:col-span-2">
                <label className="label font-bold text-gray-700">Description</label>
                <textarea
                  placeholder="Describe in detail..."
                  {...register("description", { required: true, minLength: 20 })}
                  className="textarea textarea-bordered h-32 w-full text-black bg-gray-50"
                ></textarea>
                {errors.description && <span className="text-red-500 text-xs mt-1">Min 20 chars required</span>}
              </div>

              {/* Image Upload */}
              <div className="form-control w-full md:col-span-2">
                <label className="label font-bold text-gray-700">Attach Photo</label>
                <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 ${errors.image ? 'border-red-500' : 'border-gray-300'}`}>
                   <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                   <input
                      type="file"
                      {...register("image", { required: true })}
                      accept="image/*"
                      className="file-input file-input-ghost w-full max-w-xs text-black"
                    />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full text-lg mt-4 shadow-lg text-white font-bold">
              Submit Official Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;