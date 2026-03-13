import React from "react";
import { Link } from "react-router";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-12 group">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <MdOutlineReportProblem className="text-white text-lg" />
          </div>
          <span className="text-xl font-black text-white">
            CITY<span className="text-blue-400">CARE</span>
          </span>
        </Link>

        {/* 404 Number */}
        <div className="relative mb-6">
          <span className="text-[160px] md:text-[200px] font-black text-slate-900 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[160px] md:text-[200px] font-black leading-none bg-gradient-to-b from-slate-700 to-slate-900 bg-clip-text text-transparent select-none">
              404
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="mb-3 flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-red-400 font-bold text-xs uppercase tracking-widest">
            Page Not Found
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-4 mt-3">
          This page doesn't exist
        </h2>

        <p className="text-slate-500 max-w-sm mb-10 leading-relaxed">
          The URL you requested could not be found. It may have been moved,
          deleted, or you might have mistyped the address.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold rounded-xl transition-all text-sm"
          >
            <FaArrowLeft className="text-xs" />
            Go Back
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 text-sm"
          >
            <FaHome className="text-xs" />
            Back to Home
          </Link>
        </div>

        {/* Helper links */}
        <div className="flex items-center gap-6 mt-12 text-xs font-semibold text-slate-600">
          <Link
            to="/all-issues"
            className="hover:text-slate-400 transition-colors"
          >
            All Issues
          </Link>
          <span>•</span>
          <Link
            to="/about-us"
            className="hover:text-slate-400 transition-colors"
          >
            About Us
          </Link>
          <span>•</span>
          <Link
            to="/contact-us"
            className="hover:text-slate-400 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
