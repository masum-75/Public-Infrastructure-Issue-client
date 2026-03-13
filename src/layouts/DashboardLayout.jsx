import React, { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router";
import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";
import {
  FaHome,
  FaListAlt,
  FaTicketAlt,
  FaUserCircle,
  FaUsers,
  FaChartLine,
  FaWallet,
  FaSignOutAlt,
  FaRegListAlt,
  FaClipboardCheck,
  FaMapMarkedAlt,
  FaBars,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";
import ThemeToggle from "../contexts/Themecontext/Themetoggle";

const DashboardLayout = () => {
  const { role, roleLoading } = useRole();
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const navLink = ({ isActive }) =>
    `flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    }`;

  const adminLinks = [
    {
      to: "/dashboard/admin-home",
      label: "Overview",
      icon: FaChartLine,
      color: "text-blue-400",
    },
    {
      to: "/dashboard/all-issues-admin",
      label: "All Issues",
      icon: FaListAlt,
      color: "text-indigo-400",
    },
    {
      to: "/dashboard/manage-users",
      label: "Citizens",
      icon: FaUsers,
      color: "text-emerald-400",
    },
    {
      to: "/dashboard/manage-staff",
      label: "Staff Force",
      icon: FaClipboardCheck,
      color: "text-amber-400",
    },
    {
      to: "/dashboard/payments-admin",
      label: "Financials",
      icon: FaWallet,
      color: "text-rose-400",
    },
  ];

  const staffLinks = [
    {
      to: "/dashboard/staff-home",
      label: "Stats Overview",
      icon: FaChartLine,
      color: "text-blue-400",
    },
    {
      to: "/dashboard/assigned-issues",
      label: "Task Board",
      icon: FaRegListAlt,
      color: "text-orange-400",
    },
  ];

  const citizenLinks = [
    {
      to: "/dashboard/citizen-home",
      label: "My Activity",
      icon: FaChartLine,
      color: "text-blue-400",
    },
    {
      to: "/dashboard/my-issues",
      label: "My Reports",
      icon: FaTicketAlt,
      color: "text-indigo-400",
    },
    {
      to: "/dashboard/report-issue",
      label: "New Report",
      icon: FaMapMarkedAlt,
      color: "text-emerald-400",
    },
  ];

  const currentLinks =
    role === "admin"
      ? adminLinks
      : role === "staff"
        ? staffLinks
        : citizenLinks;

  const sectionLabel =
    role === "admin"
      ? "Management"
      : role === "staff"
        ? "Operations"
        : "Reporting";

  if (roleLoading)
    return (
      <div className="h-screen flex justify-center items-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Loading Dashboard
          </p>
        </div>
      </div>
    );

  const Sidebar = () => (
    <div className="bg-slate-950 border-r border-slate-800/60 w-72 min-h-full flex flex-col p-5">
      {/* Logo */}
      <div className="mb-8 p-4 bg-slate-900 border border-slate-800/60 rounded-2xl">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <MdOutlineReportProblem className="text-white text-lg" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black text-white tracking-tight">
              CITY<span className="text-blue-400">CARE</span>
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {role || "User"} Panel
            </span>
          </div>
        </Link>
      </div>

      {/* User mini card */}
      {user && (
        <div className="flex items-center gap-3 px-3 py-3 mb-6 bg-slate-900/60 rounded-xl border border-slate-800/40">
          <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-blue-500/30 shrink-0">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user.displayName?.charAt(0) || "U"}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {user.displayName || "User"}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
      )}

      {/* Role Nav Links */}
      <nav className="flex-grow space-y-1 overflow-y-auto">
        <p className="text-[10px] font-black text-slate-600 ml-2 mb-3 uppercase tracking-[0.25em]">
          {sectionLabel}
        </p>
        {currentLinks.map(({ to, label, icon: Icon, color }) => (
          <NavLink
            key={to}
            to={to}
            className={navLink}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center gap-3">
              <Icon className={`text-sm shrink-0 ${color}`} />
              {label}
            </div>
            <FaChevronRight className="text-[9px] opacity-0 group-hover:opacity-40 transition-opacity" />
          </NavLink>
        ))}

        {/* Divider */}
        <div className="h-px bg-slate-800/60 my-4 mx-2" />

        <NavLink
          to="/dashboard/profile"
          className={navLink}
          onClick={() => setSidebarOpen(false)}
        >
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-sm text-slate-500" />
            Profile Settings
          </div>
        </NavLink>
        <Link
          to="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all duration-200"
        >
          <FaHome className="text-sm" />
          Exit to Home
        </Link>
      </nav>

      {/* Bottom: Theme + Logout */}
      <div className="pt-5 mt-5 border-t border-slate-800/60 space-y-3">
        {/* Appearance row */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
            Appearance
          </span>
          <ThemeToggle></ThemeToggle>
        </div>
        <button
          onClick={handleLogOut}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-red-500/8 hover:bg-red-500/15 border border-red-500/15 hover:border-red-500/30 text-red-400 hover:text-red-300 font-bold text-xs uppercase tracking-widest transition-all duration-200 group"
        >
          <FaSignOutAlt className="group-hover:-translate-x-0.5 transition-transform text-sm" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[200] flex">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 flex">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile Top Bar */}
        <header className="lg:hidden flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800/60 sticky top-0 z-[100]">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MdOutlineReportProblem className="text-white text-base" />
            </div>
            <span className="text-lg font-black text-white">
              CITY<span className="text-blue-400">CARE</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all"
            >
              {sidebarOpen ? (
                <FaTimes className="text-sm" />
              ) : (
                <FaBars className="text-sm" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-grow p-5 md:p-8 lg:p-10 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
