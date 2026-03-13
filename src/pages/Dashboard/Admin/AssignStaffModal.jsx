import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import { FaTimes, FaUserTie, FaCheckCircle } from "react-icons/fa";

const AssignStaffModal = ({
  issueId,
  staffList,
  onClose,
  refetchIssues,
  onSuccess,
}) => {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [mutError, setMutError] = useState("");
  const axiosSecure = useAxiosSecure();

  const assignMutation = useMutation({
    mutationFn: (staffInfo) =>
      axiosSecure.patch(`/dashboard/admin/issues/${issueId}/assign`, staffInfo),
    onSuccess: (res) => {
      if (res.data.modifiedCount > 0) {
        refetchIssues();
        onSuccess?.("Staff assigned successfully!");
        onClose();
      }
    },
    onError: () => setMutError("Failed to assign staff. Please try again."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMutError("");
    if (!selectedStaff) {
      setMutError("Please select a staff member.");
      return;
    }
    const staffMember = staffList.find((s) => s.email === selectedStaff);
    if (staffMember) {
      assignMutation.mutate({
        assignedStaffEmail: staffMember.email,
        assignedStaffName: staffMember.displayName,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-slate-900 border border-slate-700/60 rounded-3xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <FaUserTie className="text-blue-400 text-sm" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Assign Staff</h3>
              <p className="text-slate-500 text-[10px] font-medium">
                Issue ID: {issueId?.slice(-8)}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {mutError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs font-medium">
              {mutError}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Select Staff Member <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              disabled={assignMutation.isPending}
              className="w-full h-12 bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 text-sm font-semibold text-slate-300 focus:outline-none transition-all appearance-none cursor-pointer disabled:opacity-40"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
              }}
            >
              <option value="" disabled>
                Select a staff member...
              </option>
              {staffList.map((staff) => (
                <option key={staff._id} value={staff.email}>
                  {staff.displayName} — {staff.email}
                </option>
              ))}
            </select>

            {/* Staff preview card */}
            {selectedStaff &&
              (() => {
                const s = staffList.find((x) => x.email === selectedStaff);
                return s ? (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-blue-500/5 border border-blue-500/15 rounded-xl">
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-700 shrink-0">
                      {s.photoURL ? (
                        <img
                          src={s.photoURL}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm">
                          {s.displayName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">
                        {s.displayName}
                      </p>
                      <p className="text-slate-500 text-xs">{s.email}</p>
                    </div>
                  </div>
                ) : null;
              })()}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={assignMutation.isPending}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedStaff || assignMutation.isPending}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              {assignMutation.isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FaCheckCircle />
              )}
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignStaffModal;
