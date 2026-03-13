import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaUserPlus, FaTrash, FaUserTie, FaInbox } from "react-icons/fa";
import AddStaffModal from "./AddStaffModal";

const ConfirmDeleteDialog = ({ isOpen, staff, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-slate-900 border border-slate-700/60 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <FaTrash className="text-red-400 text-xl" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">
          Remove Staff Account?
        </h3>
        <p className="text-slate-400 text-sm mb-1">You are about to delete:</p>
        <p className="text-white font-bold text-sm mb-7">
          {staff?.displayName}
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
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageStaff = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const {
    data: staffList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["staffListAdmin"],
    queryFn: async () => (await axiosSecure.get("/users/staff")).data,
  });

  const deleteStaffMutation = useMutation({
    mutationFn: (email) =>
      axiosSecure.delete(`/dashboard/admin/staff/${email}`),
    onSuccess: () => {
      showToast("Staff account removed successfully.");
      queryClient.invalidateQueries({ queryKey: ["staffListAdmin"] });
    },
    onError: (error) =>
      showToast(
        error.response?.data?.message || "Failed to delete staff.",
        "error",
      ),
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          Loading staff...
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

      <ConfirmDeleteDialog
        isOpen={!!deleteTarget}
        staff={staffList.find((s) => s.email === deleteTarget)}
        onConfirm={() => {
          deleteStaffMutation.mutate(deleteTarget);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <FaUserTie className="text-amber-400 text-xl" />
            Staff Force
            <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-500/15 border border-amber-500/25 text-amber-400 text-xs font-black rounded-lg">
              {staffList.length}
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage staff accounts and permissions.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/15 hover:-translate-y-0.5 self-start sm:self-auto"
        >
          <FaUserPlus /> Add New Staff
        </button>
      </div>

      {/* Table */}
      {staffList.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden">
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60">
                  {[
                    "#",
                    "Profile",
                    "Full Name",
                    "Email",
                    "Status",
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
                {staffList.map((staff, index) => (
                  <tr
                    key={staff._id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-5 py-4 text-slate-600 text-sm tabular-nums">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/60">
                        <img
                          src={
                            staff.photoURL ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.displayName || "S")}&background=1e3a5f&color=60a5fa`
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-white group-hover:text-blue-300 transition-colors">
                      {staff.displayName}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-sm">
                      {staff.email}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full capitalize">
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setDeleteTarget(staff.email)}
                        disabled={deleteStaffMutation.isPending}
                        className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/30 disabled:opacity-40 transition-all"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-800/40">
            {staffList.map((staff, index) => (
              <div key={staff._id} className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/60 shrink-0">
                  <img
                    src={
                      staff.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.displayName || "S")}&background=1e3a5f&color=60a5fa`
                    }
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm">
                    {staff.displayName}
                  </p>
                  <p className="text-slate-500 text-xs truncate">
                    {staff.email}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget(staff.email)}
                  className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all shrink-0"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/40 border border-dashed border-slate-700/60 rounded-3xl">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-5">
            <FaInbox className="text-slate-600 text-3xl" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            No staff members yet
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            Add your first staff member to get started.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all"
          >
            <FaUserPlus /> Add Staff
          </button>
        </div>
      )}

      {isModalOpen && (
        <AddStaffModal
          onClose={() => setIsModalOpen(false)}
          refetchStaff={refetch}
          onSuccess={(msg) => showToast(msg)}
        />
      )}
    </div>
  );
};

export default ManageStaff;
