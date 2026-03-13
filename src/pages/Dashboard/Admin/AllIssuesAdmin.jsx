import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FaUserTie,
  FaBan,
  FaListAlt,
  FaBolt,
  FaCheckCircle,
} from "react-icons/fa";
import AssignStaffModal from "./AssignStaffModal";

const STATUSES = ["Pending", "In-Progress", "Resolved", "Rejected"];

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
  Rejected: {
    text: "text-red-300",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    dot: "bg-red-400",
  },
  Pending: {
    text: "text-sky-300",
    bg: "bg-sky-400/10",
    border: "border-sky-400/20",
    dot: "bg-sky-400",
  },
};

const ConfirmRejectDialog = ({ isOpen, issue, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-slate-900 border border-slate-700/60 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <FaBan className="text-red-400 text-2xl" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">
          Reject This Issue?
        </h3>
        <p className="text-slate-400 text-sm mb-1">You are about to reject:</p>
        <p className="text-white font-bold text-sm mb-7 line-clamp-1">
          "{issue?.title}"
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
            className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all"
          >
            Yes, Reject
          </button>
        </div>
      </div>
    </div>
  );
};

const AllIssuesAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const {
    data: issueData = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allIssuesAdmin", filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const res = await axiosSecure.get(
        `/issues/all?${params.toString()}&limit=1000`,
      );
      return res.data;
    },
  });
  const issues = issueData.issues || [];

  const { data: staffList = [] } = useQuery({
    queryKey: ["staffList"],
    queryFn: async () => (await axiosSecure.get("/users/staff")).data,
    staleTime: 5 * 60 * 1000,
  });

  const rejectMutation = useMutation({
    mutationFn: (issueId) =>
      axiosSecure.patch(`/dashboard/admin/issues/${issueId}/reject`),
    onSuccess: () => {
      showToast("Issue rejected successfully.");
      refetch();
    },
    onError: () => showToast("Only Pending issues can be rejected.", "error"),
  });

  const selectClass =
    "h-10 bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 rounded-xl px-3 text-xs font-semibold text-slate-300 focus:outline-none transition-all appearance-none cursor-pointer";
  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
    paddingRight: "26px",
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          Loading issues...
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
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

      <ConfirmRejectDialog
        isOpen={!!rejectTarget}
        issue={issues.find((i) => i._id === rejectTarget)}
        onConfirm={() => {
          rejectMutation.mutate(rejectTarget);
          setRejectTarget(null);
        }}
        onCancel={() => setRejectTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <FaListAlt className="text-blue-400 text-xl" />
            All Reported Issues
            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs font-black rounded-lg">
              {issues.length}
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Assign staff and manage issue statuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((p) => ({ ...p, status: e.target.value }))
            }
            className={selectClass}
            style={selectStyle}
          >
            <option value="">All Status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters((p) => ({ ...p, priority: e.target.value }))
            }
            className={selectClass}
            style={selectStyle}
          >
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden">
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/60">
                {[
                  "#",
                  "Issue Info",
                  "Status",
                  "Priority",
                  "Assigned Staff",
                  "Actions",
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
              {issues.length > 0 ? (
                issues.map((issue, index) => {
                  const sc =
                    STATUS_CONFIG[issue.status] || STATUS_CONFIG["Pending"];
                  const canAssign =
                    !issue.assignedStaffEmail && issue.status !== "Rejected";
                  const canReject = issue.status === "Pending";
                  return (
                    <tr
                      key={issue._id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-5 py-4 text-slate-600 text-sm tabular-nums">
                        {index + 1}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-white text-sm line-clamp-1 group-hover:text-blue-300 transition-colors">
                          {issue.title}
                        </p>
                        <span className="inline-block text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md mt-1">
                          {issue.category}
                        </span>
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
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${
                            issue.priority === "High"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          {issue.priority === "High" && (
                            <FaBolt className="text-[9px]" />
                          )}
                          {issue.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {issue.assignedStaffName ? (
                          <div className="flex items-center gap-1.5">
                            <FaCheckCircle className="text-emerald-400 text-xs shrink-0" />
                            <span className="text-white font-semibold text-sm truncate max-w-[130px]">
                              {issue.assignedStaffName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-sm italic">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedIssueId(issue._id);
                              setIsAssignOpen(true);
                            }}
                            disabled={!canAssign}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-[10px] font-bold rounded-lg transition-all"
                          >
                            <FaUserTie className="text-[9px]" /> Assign
                          </button>
                          <button
                            onClick={() => setRejectTarget(issue._id)}
                            disabled={!canReject || rejectMutation.isPending}
                            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            title="Reject issue"
                          >
                            <FaBan className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center text-slate-600 text-sm"
                  >
                    No issues found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-slate-800/40">
          {issues.map((issue) => {
            const sc = STATUS_CONFIG[issue.status] || STATUS_CONFIG["Pending"];
            return (
              <div key={issue._id} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm line-clamp-1">
                      {issue.title}
                    </p>
                    <span className="inline-block text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md mt-1">
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
                {issue.assignedStaffName && (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                    <FaCheckCircle className="text-[10px]" />{" "}
                    {issue.assignedStaffName}
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSelectedIssueId(issue._id);
                      setIsAssignOpen(true);
                    }}
                    disabled={
                      !!issue.assignedStaffEmail || issue.status === "Rejected"
                    }
                    className="flex-1 py-2 bg-blue-600/80 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <FaUserTie className="text-[10px]" /> Assign
                  </button>
                  <button
                    onClick={() => setRejectTarget(issue._id)}
                    disabled={issue.status !== "Pending"}
                    className="w-9 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 hover:text-red-400 disabled:opacity-30 transition-all"
                  >
                    <FaBan className="text-xs" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isAssignOpen && (
        <AssignStaffModal
          issueId={selectedIssueId}
          staffList={staffList}
          onClose={() => setIsAssignOpen(false)}
          refetchIssues={refetch}
          onSuccess={(msg) => showToast(msg)}
        />
      )}
    </div>
  );
};

export default AllIssuesAdmin;
