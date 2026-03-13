import React from "react";
import {
  FaShieldAlt,
  FaChartLine,
  FaClock,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router";

const features = [
  {
    icon: FaShieldAlt,
    title: "Full Transparency",
    desc: "Every action is recorded in the issue timeline. Citizens and authorities share one source of truth with no hidden updates.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-500/25",
    stat: "100%",
    statLabel: "Audit Trail",
  },
  {
    icon: FaChartLine,
    title: "Data Driven",
    desc: "We help authorities analyze infrastructure patterns and hotspots to prioritize budgets and city-wide planning.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "hover:border-emerald-500/25",
    stat: "98%",
    statLabel: "Accuracy",
  },
  {
    icon: FaClock,
    title: "Rapid Response",
    desc: "Automated staff assignment and priority scoring reduce average response times by over 60% compared to manual systems.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "hover:border-amber-500/25",
    stat: "48h",
    statLabel: "Avg Response",
  },
  {
    icon: FaUsers,
    title: "Citizen Focused",
    desc: "Built for real people. Premium support, real-time notifications, and a clean interface accessible on any device.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "hover:border-indigo-500/25",
    stat: "3.2k+",
    statLabel: "Active Users",
  },
];

const WhyChooseUs = () => (
  <div>
    {/* Header */}
    <div className="text-center max-w-2xl mx-auto mb-14">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-5">
        <FaShieldAlt className="text-amber-400 text-xs" />
        <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">
          Why CityCare
        </span>
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
        Making City Life <span className="text-amber-400">Better</span>
      </h2>
      <p className="text-lg text-slate-400 leading-relaxed">
        Our system bridges the gap between citizens and authorities through
        technology, transparency, and community power.
      </p>
    </div>

    {/* Feature Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
      {features.map((f, i) => (
        <div
          key={i}
          className={`group p-7 bg-slate-900 border border-slate-800/60 ${f.border} rounded-2xl transition-all duration-300 flex flex-col`}
        >
          {/* Icon + Stat row */}
          <div className="flex items-start justify-between mb-6">
            <div
              className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            >
              <f.icon className={`text-xl ${f.color}`} />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-black ${f.color}`}>{f.stat}</p>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                {f.statLabel}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-2.5">{f.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed flex-grow">
            {f.desc}
          </p>
        </div>
      ))}
    </div>

    {/* Bottom Banner */}
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800/60 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 pointer-events-none" />
      <div className="relative z-10">
        <h3 className="text-2xl font-black text-white mb-1.5">
          Ready to make a difference?
        </h3>
        <p className="text-slate-400 text-sm">
          Join thousands of citizens already improving their communities.
        </p>
      </div>
      <div className="relative z-10 flex items-center gap-3 shrink-0">
        <Link
          to="/all-issues"
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm rounded-xl transition-all"
        >
          Browse Issues
        </Link>
        <Link
          to="/register"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
        >
          Get Started
          <FaArrowRight className="text-xs" />
        </Link>
      </div>
    </div>
  </div>
);

export default WhyChooseUs;
