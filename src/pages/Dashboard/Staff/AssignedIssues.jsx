import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FaEye,
  FaMapMarkerAlt,
  FaInbox,
  FaCheckCircle,
  FaBolt,
  FaSpinner,
} from "react-icons/fa";
import { Link } from "react-router";

const STATUS_OPTIONS = [
  { value: "In-Progress", label: "Start Work" },
  { value: "Working", label: "Progress Update" },
  { value: "Resolved", label: "Mark Resolved" },
  { value: "Closed", label: "Close Issue" },
];

const STATUS_CONFIG = {
  Resolved: {
    text: "text-emerald-300",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    dot: "bg-emerald-400",
  },
  "In-Progress": {
    text: "text-amber-300",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    dot: "bg-amber-400",
  },
  Working: {
    text: "text-amber-300",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    dot: "bg-amber-400",
  },
  Closed: {
    text: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-400/20",
    dot: "bg-slate-500",
  },
  Pending: {
    text: "text-sky-300",
    bg: "bg-sky-400/10",
    border: "border-sky-400/20",
    dot: "bg-sky-400",
  },
};

// Inline confirm dialog
const ConfirmDialog = ({ isOpen, status, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-slate-900 border border-slate-700/60 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <FaCheckCircle className="text-blue-400 text-2xl" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">
          Confirm Status Update
        </h3>
        <p className="text-slate-400 text-sm mb-7">
          Update this issue status to{" "}
          <span className="text-white font-bold">"{status}"</span>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all"
          >
            Yes, Update
          </button>
        </div>
      </div>
    </div>
  );
};

const AssignedIssues = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [pendingUpdate, setPendingUpdate] = useState(null); // { issueId, newStatus }
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const { data: assignedIssues = [], isLoading } = useQuery({
    queryKey: ["assignedIssues", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/dashboard/staff/assigned-issues?email=${user.email}`,
      );
      return res.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ issueId, newStatus }) =>
      axiosSecure.patch(`/dashboard/staff/issues/${issueId}/status`, {
        newStatus,
      }),
    onSuccess: () => {
      showToast("Issue status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["assignedIssues"] });
    },
    onError: () => showToast("Update failed. Check your connection.", "error"),
  });

  const handleStatusChange = (e, issueId) => {
    const newStatus = e.target.value;
    if (!newStatus) return;
    setPendingUpdate({ issueId, newStatus });
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          Loading tasks...
        </p>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9998] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl text-sm font-bold ${
            toast.type === "error"
              ? "bg-red-900/95 border-red-700/60 text-red-200"
              : "bg-emerald-900/95 border-emerald-700/60 text-emerald-200"
          }`}
        >
          {toast.type === "error" ? "✕" : "✓"} {toast.message}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!pendingUpdate}
        status={pendingUpdate?.newStatus}
        onConfirm={() => {
          statusMutation.mutate(pendingUpdate);
          setPendingUpdate(null);
        }}
        onCancel={() => setPendingUpdate(null)}
      />

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            Assigned Issues
            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs font-black rounded-lg">
              {assignedIssues.length}
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage and update the status of citizen reports assigned to you.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800/60 rounded-xl">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-slate-400">Live Updates</span>
        </div>
      </header>

      {assignedIssues.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60">
                  {[
                    "Issue Details",
                    "Location",
                    "Status",
                    "Priority",
                    "Update Status",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {assignedIssues.map((issue) => {
                  const sc =
                    STATUS_CONFIG[issue.status] || STATUS_CONFIG["Pending"];
                  return (
                    <tr
                      key={issue._id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors line-clamp-1">
                          {issue.title}
                        </p>
                        <span className="inline-block text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/10 px-2 py-0.5 rounded-md mt-1">
                          {issue.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                          <FaMapMarkerAlt className="text-red-400 shrink-0 text-xs" />
                          <span className="truncate max-w-[140px]">
                            {issue.location}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${sc.bg} border ${sc.border} rounded-full`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                          />
                          <span className={`text-[10px] font-bold ${sc.text}`}>
                            {issue.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black ${
                            issue.priority === "High"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-slate-800 text-slate-500 border border-slate-700/40"
                          }`}
                        >
                          {issue.priority === "High" && (
                            <FaBolt className="text-[9px]" />
                          )}
                          {issue.priority}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          onChange={(e) => handleStatusChange(e, issue._id)}
                          value=""
                          disabled={
                            statusMutation.isPending ||
                            issue.status === "Closed"
                          }
                          className="w-[160px] h-9 bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 text-xs font-semibold text-slate-300 focus:outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 10px center",
                          }}
                        >
                          <option value="" disabled>
                            Change Status
                          </option>
                          {STATUS_OPTIONS.map((opt) => (
                            <option
                              key={opt.value}
                              value={opt.value}
                              disabled={issue.status === opt.value}
                            >
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          to={`/issue/${issue._id}`}
                          className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                        >
                          <FaEye className="text-sm" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-800/40">
            {assignedIssues.map((issue) => {
              const sc =
                STATUS_CONFIG[issue.status] || STATUS_CONFIG["Pending"];
              return (
                <div key={issue._id} className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-white text-sm line-clamp-2">
                        {issue.title}
                      </p>
                      <span className="inline-block text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/10 px-2 py-0.5 rounded-md mt-1">
                        {issue.category}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 ${sc.bg} border ${sc.border} rounded-full shrink-0`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      <span className={`text-[10px] font-bold ${sc.text}`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <FaMapMarkerAlt className="text-red-400 shrink-0" />
                    {issue.location}
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      onChange={(e) => handleStatusChange(e, issue._id)}
                      value=""
                      disabled={
                        statusMutation.isPending || issue.status === "Closed"
                      }
                      className="flex-1 h-9 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 text-xs font-semibold text-slate-300 focus:outline-none disabled:opacity-40"
                    >
                      <option value="" disabled>
                        Change Status
                      </option>
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <Link
                      to={`/issue/${issue._id}`}
                      className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all shrink-0"
                    >
                      <FaEye className="text-sm" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/40 border border-dashed border-slate-700/60 rounded-3xl">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FaInbox className="text-slate-600 text-3xl" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">All clear!</h3>
          <p className="text-slate-500 text-sm text-center max-w-xs">
            No issues assigned to you yet. New reports will appear here as they
            are assigned.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignedIssues;
