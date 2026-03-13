import React from "react";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import { Navigate, useLocation, Link } from "react-router";
import { MdOutlineReportProblem } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";

const RoleBasedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
          <div
            className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-500/30 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          />
        </div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          Verifying access...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role === requiredRole) {
    return children;
  }

  // Access denied screen
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <FaShieldAlt className="text-red-400 text-3xl" />
        </div>

        {/* Code */}
        <p className="text-red-500/60 font-black text-sm uppercase tracking-widest mb-3">
          403 — Access Denied
        </p>

        <h2 className="text-3xl font-black text-white mb-3">
          You can't be here
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          This page requires the{" "}
          <span className="text-white font-bold">{requiredRole}</span> role.
          Your current role is{" "}
          <span className="font-mono font-bold text-blue-400">
            {role || "unknown"}
          </span>
          .
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-xl transition-all text-sm"
          >
            <MdOutlineReportProblem className="text-sm" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export const AdminRoute = ({ children }) => (
  <RoleBasedRoute requiredRole="admin">{children}</RoleBasedRoute>
);
export const StaffRoute = ({ children }) => (
  <RoleBasedRoute requiredRole="staff">{children}</RoleBasedRoute>
);
export const CitizenRoute = ({ children }) => (
  <RoleBasedRoute requiredRole="citizen">{children}</RoleBasedRoute>
);

export default RoleBasedRoute;
