import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaRegHeart,
  FaHeart,
  FaArrowRight,
  FaBolt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useRole from "../../hooks/useRole";

const STATUS_CONFIG = {
  Resolved: {
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  "In-Progress": {
    dot: "bg-amber-400",
    text: "text-amber-300",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  Working: {
    dot: "bg-amber-400",
    text: "text-amber-300",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  Rejected: {
    dot: "bg-red-400",
    text: "text-red-300",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
  Pending: {
    dot: "bg-sky-400",
    text: "text-sky-300",
    bg: "bg-sky-400/10",
    border: "border-sky-400/20",
  },
};

const Toast = ({ message, type }) => (
  <div
    className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl text-sm font-bold transition-all duration-300 ${
      type === "error"
        ? "bg-red-900/90 border-red-700/60 text-red-200"
        : "bg-emerald-900/90 border-emerald-700/60 text-emerald-200"
    }`}
  >
    {type === "error" ? "✕" : "✓"} {message}
  </div>
);

const IssueCard = ({ issue, refetchIssues }) => {
  const { user } = useAuth();
  const { isBlocked } = useRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const status = issue.status || "Pending";
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG["Pending"];

  const upvoteMutation = useMutation({
    mutationFn: (issueId) => axiosSecure.patch(`/issues/${issueId}/upvote`),
    onSuccess: (data) => {
      if (data.data.modifiedCount > 0) {
        queryClient.invalidateQueries({ queryKey: ["issues"] });
        refetchIssues?.();
        showToast("Issue upvoted successfully!");
      }
    },
    onError: (error) => {
      const status = error.response?.status;
      if (status === 409) showToast("You already upvoted this issue.", "error");
      else if (status === 403) showToast("Access denied.", "error");
      else showToast("Failed to upvote. Try again.", "error");
    },
  });

  const handleUpvote = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: "/all-issues" } });
      return;
    }
    if (isBlocked) {
      showToast("Your account is restricted.", "error");
      return;
    }
    upvoteMutation.mutate(issue._id);
  };

  const isOwner = user?.email === issue.citizenEmail;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="group bg-slate-900 border border-slate-800/60 hover:border-blue-500/25 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full">
        {/* Image */}
        <figure className="relative h-52 overflow-hidden shrink-0">
          <img
            src={
              issue.imageUrl ||
              "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=600"
            }
            alt={issue.title}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=600";
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

          {/* Status badge */}
          <div
            className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 ${statusConfig.bg} backdrop-blur-sm border ${statusConfig.border} rounded-full`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
            <span className={`text-[10px] font-bold ${statusConfig.text}`}>
              {status}
            </span>
          </div>

          {/* Priority badge */}
          {issue.priority === "High" && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-red-500/15 backdrop-blur-sm border border-red-500/30 rounded-full">
              <FaBolt className="text-red-400 text-[9px]" />
              <span className="text-red-300 text-[10px] font-bold">Urgent</span>
            </div>
          )}
        </figure>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex-grow">
            {/* Category */}
            <span className="inline-block text-[10px] font-bold text-blue-400 uppercase tracking-widest px-2.5 py-1 bg-blue-500/10 border border-blue-500/10 rounded-lg mb-3">
              {issue.category}
            </span>

            {/* Title */}
            <h2 className="text-base font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors">
              {issue.title}
            </h2>

            {/* Location */}
            <p className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-3">
              <FaMapMarkerAlt className="text-red-400 shrink-0" />
              <span className="truncate">{issue.location}</span>
            </p>

            {/* Description */}
            <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-800/60">
            <button
              onClick={handleUpvote}
              disabled={upvoteMutation.isPending || isOwner}
              title={
                isOwner
                  ? "You cannot upvote your own issue"
                  : "Upvote this issue"
              }
              className={`flex items-center gap-2 text-sm font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                issue.hasUpvoted
                  ? "text-red-400"
                  : "text-slate-500 hover:text-red-400"
              }`}
            >
              {upvoteMutation.isPending ? (
                <span className="w-4 h-4 border-2 border-slate-600 border-t-red-400 rounded-full animate-spin" />
              ) : issue.hasUpvoted ? (
                <FaHeart />
              ) : (
                <FaRegHeart />
              )}
              <span>{issue.upvotes}</span>
            </button>

            <Link
              to={`/issue/${issue._id}`}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors group/btn"
            >
              View Case
              <FaArrowRight className="text-[10px] group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default IssueCard;
