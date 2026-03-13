import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FaTicketAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaCrown,
  FaArrowRight,
  FaBolt,
  FaTimesCircle,
  
} from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";
import { HiOutlineHand } from "react-icons/hi";
import { Link, useNavigate } from "react-router";

const CitizenHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["citizen-stats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/dashboard/citizen-stats/${user?.email}`,
      );
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          Loading your data...
        </p>
      </div>
    );

  const statCards = [
    {
      title: "Total Reported",
      value: stats?.totalIssues || 0,
      icon: FaTicketAlt,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/15",
    },
    {
      title: "Pending Issues",
      value: stats?.pendingIssues || 0,
      icon: FaHourglassHalf,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/15",
    },
    {
      title: "Resolved Issues",
      value: stats?.resolvedIssues || 0,
      icon: FaCheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/15",
    },
    {
      title: "Rejected Issues",
      value: stats?.rejectedIssues || 0,
      icon: FaTimesCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/15",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="flex text-slate-500 text-sm font-medium mb-1">
            Good to see you back <HiOutlineHand size={18} />
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            {user?.displayName?.split(" ")[0] || "Citizen"}'s Dashboard
          </h1>
        </div>
        {stats?.isPremium && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl self-start sm:self-auto">
            <FaCrown className="text-amber-400 text-sm" />
            <span className="text-amber-300 font-bold text-xs uppercase tracking-widest">
              Premium Member
            </span>
          </div>
        )}
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ title, value, icon: Icon, color, bg, border }) => (
          <div
            key={title}
            className={`p-6 bg-slate-900 border ${border} rounded-2xl group hover:border-opacity-50 transition-all duration-300`}
          >
            <div
              className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <Icon className={`text-lg ${color}`} />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
              {title}
            </p>
            <p className={`text-4xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Report CTA */}
        <div className="relative overflow-hidden p-8 bg-gradient-to-br from-blue-600/15 via-blue-600/8 to-slate-900 border border-blue-500/20 rounded-2xl">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-500/15 rounded-xl flex items-center justify-center mb-5">
              <MdOutlineReportProblem className="text-blue-400 text-2xl" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">
              Found an infrastructure problem?
            </h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Spotted a pothole, broken streetlight, or garbage overflow? Report
              it now and help the city authorities fix it faster.
            </p>
            <button
              onClick={() => navigate("/dashboard/report-issue")}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 text-sm"
            >
              <MdOutlineReportProblem />
              Report an Issue
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>

        {/* My Issues quick view */}
        <div className="relative overflow-hidden p-8 bg-gradient-to-br from-indigo-600/10 via-indigo-600/5 to-slate-900 border border-indigo-500/20 rounded-2xl">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-indigo-500/15 rounded-xl flex items-center justify-center mb-5">
              <FaTicketAlt className="text-indigo-400 text-xl" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">
              Track your reports
            </h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Follow the real-time status of all your submitted reports. See
              when authorities have acted on your issues.
            </p>
            <Link
              to="/dashboard/my-issues"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600/80 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-sm"
            >
              <FaTicketAlt />
              View My Reports
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>

      {/* Premium upsell (only if not premium) */}
      {!stats?.isPremium && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-7 bg-amber-500/5 border border-amber-500/15 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-amber-500/15 rounded-xl flex items-center justify-center shrink-0">
              <FaBolt className="text-amber-400 text-lg" />
            </div>
            <div>
              <p className="font-black text-white text-base">
                Upgrade to Premium
              </p>
              <p className="text-amber-400/70 text-xs font-medium">
                Remove the 3-report limit and get priority support for just
                1,000 Taka.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/profile"
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all text-sm shrink-0"
          >
            <FaCrown /> Get Premium
          </Link>
        </div>
      )}
    </div>
  );
};

export default CitizenHome;
