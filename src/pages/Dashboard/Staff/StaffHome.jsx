import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FaClipboardList,
  FaCheck,
  FaTools,
  FaChartLine,
  FaBolt,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useAuth from "../../../hooks/useAuth";

const StatCard = ({ title, value, icon: Icon, color, bg, border }) => (
  <div
    className={`relative overflow-hidden p-6 bg-slate-900 border ${border} rounded-2xl group hover:border-opacity-50 transition-all duration-300`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
          {title}
        </p>
        <h3 className="text-4xl font-black text-white">{value}</h3>
      </div>
      <div
        className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className={`text-xl ${color}`} />
      </div>
    </div>
    {/* Subtle bottom accent */}
    <div
      className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full ${bg.replace("/10", "/60")} transition-all duration-500 rounded-full`}
    />
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-400 text-xs font-bold mb-1">{label}</p>
        <p className="text-emerald-400 font-black text-lg">
          {payload[0].value}{" "}
          <span className="text-xs font-bold text-slate-500">resolved</span>
        </p>
      </div>
    );
  }
  return null;
};

const StaffHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["staffStats"],
    queryFn: async () => (await axiosSecure.get("/dashboard/staff/stats")).data,
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          Loading analytics...
        </p>
      </div>
    );

  const chartData =
    stats.dailyResolved?.map((item) => ({
      name: new Date(item._id).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      Resolved: item.resolvedCount,
    })) || [];

  const statCards = [
    {
      title: "Total Assigned",
      value: stats.totalAssigned || 0,
      icon: FaClipboardList,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/15",
    },
    {
      title: "In Progress",
      value: stats.inProgressCount || 0,
      icon: FaTools,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/15",
    },
    {
      title: "Issues Resolved",
      value: stats.resolvedCount || 0,
      icon: FaCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/15",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Staff Analytics
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Monitor your issue resolution progress and performance.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800/60 rounded-xl">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-slate-400">Live Updates</span>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-7">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                Weekly Performance
              </h3>
              <p className="text-slate-500 text-xs">
                Daily resolved issues trend
              </p>
            </div>
          </div>
          {stats.resolvedCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <FaBolt className="text-emerald-400 text-[10px]" />
              <span className="text-emerald-400 text-xs font-bold">
                {stats.resolvedCount} Total
              </span>
            </div>
          )}
        </div>

        {chartData.length > 0 ? (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="resolvedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#1e293b"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "#334155", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="Resolved"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#resolvedGradient)"
                  dot={{ fill: "#34d399", strokeWidth: 0, r: 4 }}
                  activeDot={{
                    r: 6,
                    fill: "#34d399",
                    stroke: "#0f172a",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[320px] flex flex-col items-center justify-center bg-slate-800/30 border border-dashed border-slate-700/60 rounded-2xl">
            <FaChartLine className="text-slate-700 text-4xl mb-3" />
            <p className="text-slate-500 text-sm font-medium">
              No resolution data yet for this week.
            </p>
            <p className="text-slate-600 text-xs mt-1">
              Resolve some issues to see your performance chart.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffHome;
