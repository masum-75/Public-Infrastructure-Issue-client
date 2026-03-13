import React from "react";
import { Link } from "react-router";
import { FaArrowRight, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";

const PERKS = [
  "Free to get started",
  "Report in under 2 minutes",
  "Real-time status tracking",
  "48h average resolution",
];

const CtaSection = () => (
  <section className="py-28 bg-slate-950 relative overflow-hidden">
    {/* Animated gradient mesh */}
    <div className="absolute inset-0">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/8 via-transparent to-violet-600/8" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px]" />
    </div>

    {/* Grid overlay */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      {/* Icon cluster */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 rotate-[-6deg]">
          <MdOutlineReportProblem className="text-white text-2xl" />
        </div>
        <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center rotate-[6deg]">
          <FaCheckCircle className="text-emerald-400 text-lg" />
        </div>
        <div className="w-10 h-10 bg-rose-500/20 border border-rose-500/30 rounded-xl flex items-center justify-center rotate-[-3deg]">
          <FaMapMarkerAlt className="text-rose-400 text-lg" />
        </div>
      </div>

      <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
        Your city improves when
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-[length:200%] animate-gradient">
          citizens speak up
        </span>
      </h2>

      <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
        Join over <span className="text-white font-bold">3,200 citizens</span>{" "}
        who are already using CityCare to fix potholes, broken lights, water
        leaks, and more — one report at a time.
      </p>

      {/* Perks list */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-12">
        {PERKS.map((p) => (
          <div
            key={p}
            className="flex items-center gap-2 text-slate-400 text-sm"
          >
            <FaCheckCircle className="text-emerald-400 text-xs shrink-0" />
            {p}
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/register"
          className="group flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all duration-200 shadow-xl shadow-blue-600/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 text-base"
        >
          <MdOutlineReportProblem className="text-xl" />
          Start Reporting Free
          <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          to="/all-issues"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-white font-bold rounded-2xl transition-all duration-200 text-base"
        >
          View Public Reports
        </Link>
      </div>

      {/* Bottom micro-copy */}
      <p className="mt-8 text-slate-600 text-xs font-medium">
        No credit card required · Free forever · Cancel anytime
      </p>
    </div>

    {/* Bottom gradient fade */}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />

    <style>{`
            @keyframes gradient {
                0%, 100% { background-position: 0% center; }
                50%       { background-position: 100% center; }
            }
            .animate-gradient { animation: gradient 4s ease infinite; }
        `}</style>
  </section>
);

export default CtaSection;
