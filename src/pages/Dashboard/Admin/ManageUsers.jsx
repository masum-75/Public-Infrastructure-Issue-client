import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FaUserCheck,
  FaUserSlash,
  FaUserShield,
  FaUsers,
  FaInbox,
} from "react-icons/fa";

const ConfirmRoleDialog = ({ isOpen, user, newRole, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-slate-900 border border-slate-700/60 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <FaUserShield className="text-blue-400 text-2xl" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">Change Role?</h3>
        <p className="text-slate-400 text-sm mb-2">
          Promote{" "}
          <span className="text-white font-bold">{user?.displayName}</span> to
        </p>
        <p className="text-blue-400 font-black text-xl mb-7 uppercase">
          {newRole}
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
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const ROLE_STYLES = {
  admin: {
    text: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  staff: {
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  citizen: {
    text: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
  },
};

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [roleTarget, setRoleTarget] = useState(null); // { user, newRole }
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsersAdmin"],
    queryFn: async () => (await axiosSecure.get("/users")).data,
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) =>
      axiosSecure.patch(`/users/role/${id}`, { role }),
    onSuccess: (res) => {
      if (res.data.modifiedCount > 0) {
        showToast("User role updated successfully.");
        queryClient.invalidateQueries({ queryKey: ["allUsersAdmin"] });
      }
    },
    onError: () => showToast("Failed to update role.", "error"),
  });

  const blockMutation = useMutation({
    mutationFn: ({ id, isBlocked }) =>
      axiosSecure.patch(`/users/${id}/block`, { isBlocked }),
    onSuccess: (res, variables) => {
      if (res.data.modifiedCount > 0) {
        showToast(
          `User ${variables.isBlocked ? "blocked" : "unblocked"} successfully.`,
        );
        queryClient.invalidateQueries({ queryKey: ["allUsersAdmin"] });
      }
    },
    onError: () => showToast("Failed to update user status.", "error"),
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          Loading users...
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

      <ConfirmRoleDialog
        isOpen={!!roleTarget}
        user={roleTarget?.user}
        newRole={roleTarget?.newRole}
        onConfirm={() => {
          roleMutation.mutate({
            id: roleTarget.user._id,
            role: roleTarget.newRole,
          });
          setRoleTarget(null);
        }}
        onCancel={() => setRoleTarget(null)}
      />

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <FaUsers className="text-indigo-400 text-xl" />
          Manage Citizens
          <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 text-xs font-black rounded-lg">
            {users.length}
          </span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Manage roles and access for all registered users.
        </p>
      </div>

      {/* Table */}
      {users.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden">
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60">
                  {["#", "User Info", "Role", "Status", "Actions"].map((h) => (
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
                {users.map((user, index) => {
                  const rs = ROLE_STYLES[user.role] || ROLE_STYLES.citizen;
                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-5 py-4 text-slate-600 text-sm tabular-nums">
                        {index + 1}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/60 shrink-0">
                            <img
                              src={
                                user.photoURL ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || "U")}&background=1e293b&color=60a5fa`
                              }
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                              {user.displayName || "—"}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 ${rs.bg} border ${rs.border} ${rs.text} text-[10px] font-bold rounded-full capitalize`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            user.isBlocked
                              ? "bg-red-500/10 border border-red-500/20 text-red-400"
                              : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${user.isBlocked ? "bg-red-400" : "bg-emerald-400"}`}
                          />
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {user.role === "citizen" && (
                            <button
                              onClick={() =>
                                setRoleTarget({ user, newRole: "staff" })
                              }
                              disabled={roleMutation.isPending}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-[10px] font-bold rounded-lg transition-all"
                            >
                              <FaUserShield className="text-[10px]" /> Make
                              Staff
                            </button>
                          )}
                          <button
                            onClick={() =>
                              blockMutation.mutate({
                                id: user._id,
                                isBlocked: !user.isBlocked,
                              })
                            }
                            disabled={blockMutation.isPending}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all disabled:opacity-40 ${
                              user.isBlocked
                                ? "bg-emerald-600/80 hover:bg-emerald-600 text-white"
                                : "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400"
                            }`}
                          >
                            {user.isBlocked ? (
                              <>
                                <FaUserCheck className="text-[10px]" /> Unblock
                              </>
                            ) : (
                              <>
                                <FaUserSlash className="text-[10px]" /> Block
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-800/40">
            {users.map((user) => {
              const rs = ROLE_STYLES[user.role] || ROLE_STYLES.citizen;
              return (
                <div key={user._id} className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                      <img
                        src={
                          user.photoURL ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=1e293b&color=60a5fa`
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm">
                        {user.displayName || "—"}
                      </p>
                      <p className="text-slate-500 text-xs truncate">
                        {user.email}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 ${rs.bg} border ${rs.border} ${rs.text} text-[10px] font-bold rounded-full capitalize shrink-0`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {user.role === "citizen" && (
                      <button
                        onClick={() =>
                          setRoleTarget({ user, newRole: "staff" })
                        }
                        className="flex-1 py-2 bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <FaUserShield className="text-[10px]" /> Make Staff
                      </button>
                    )}
                    <button
                      onClick={() =>
                        blockMutation.mutate({
                          id: user._id,
                          isBlocked: !user.isBlocked,
                        })
                      }
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        user.isBlocked
                          ? "bg-emerald-600/80 hover:bg-emerald-600 text-white"
                          : "bg-red-500/10 border border-red-500/20 text-red-400"
                      }`}
                    >
                      {user.isBlocked ? (
                        <>
                          <FaUserCheck className="text-[10px]" /> Unblock
                        </>
                      ) : (
                        <>
                          <FaUserSlash className="text-[10px]" /> Block
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/40 border border-dashed border-slate-700/60 rounded-3xl">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-5">
            <FaInbox className="text-slate-600 text-3xl" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No users found</h3>
          <p className="text-slate-500 text-sm">
            Registered citizens will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
