import React from "react";
import {
  FaPencilAlt,
  FaRegEye,
  FaTachometerAlt,
  FaBell,
  FaCrown,
  FaShieldAlt,
} from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";

const features = [
  {
    icon: FaPencilAlt,
    title: "Easy Reporting",
    description:
      "Submit an issue with a photo, location, and description in under a minute. Fast, simple, and mobile-friendly.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-500/25",
    glow: "group-hover:bg-blue-500/5",
  },
  {
    icon: FaRegEye,
    title: "Transparent Tracking",
    description:
      "Follow your report's real-time status: Pending → In Progress → Resolved. Stay informed at every step.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "hover:border-emerald-500/25",
    glow: "group-hover:bg-emerald-500/5",
  },
  {
    icon: FaTachometerAlt,
    title: "Priority Boosting",
    description:
      "Boost critical issues to the top of the queue for faster resolution. Perfect for urgent community needs.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "hover:border-amber-500/25",
    glow: "group-hover:bg-amber-500/5",
  },
  {
    icon: FaBell,
    title: "Real-time Alerts",
    description:
      "Get instant notifications when your report status changes or when authorities post an official update.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "hover:border-indigo-500/25",
    glow: "group-hover:bg-indigo-500/5",
  },
  {
    icon: FaCrown,
    title: "Premium Membership",
    description:
      "Unlock unlimited issue reporting, priority support, and exclusive analytics with a premium subscription.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "hover:border-yellow-500/25",
    glow: "group-hover:bg-yellow-500/5",
  },
  {
    icon: FaShieldAlt,
    title: "Verified Resolutions",
    description:
      "Every resolved issue is confirmed by our staff team. Citizens can rate resolutions for full accountability.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "hover:border-rose-500/25",
    glow: "group-hover:bg-rose-500/5",
  },
];

const FeaturesSection = () => (
  <div>
    {/* Section Header */}
    <div className="text-center max-w-2xl mx-auto mb-14">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-5">
        <MdOutlineReportProblem className="text-blue-400 text-sm" />
        <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">
          Platform Features
        </span>
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
        Everything You <span className="text-blue-400">Need</span>
      </h2>
      <p className="text-lg text-slate-400 leading-relaxed">
        Empowering citizens to drive municipal improvement through transparency,
        technology, and community action.
      </p>
    </div>

    {/* Feature Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`group relative p-7 bg-slate-900 border border-slate-800/60 ${feature.border} rounded-2xl transition-all duration-300 overflow-hidden cursor-default`}
        >
          {/* Hover glow background */}
          <div
            className={`absolute inset-0 ${feature.glow} transition-colors duration-300 rounded-2xl`}
          />

          <div className="relative z-10">
            {/* Icon */}
            <div
              className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
            >
              <feature.icon className={`text-xl ${feature.color}`} />
            </div>

            {/* Number badge */}
            <span className="absolute top-7 right-7 text-xs font-black text-slate-700 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>

            <h3 className="text-lg font-bold text-white mb-2.5">
              {feature.title}
            </h3>

            <p className="text-slate-400 leading-relaxed text-sm">
              {feature.description}
            </p>

            {/* Bottom accent line */}
            <div
              className={`mt-5 h-0.5 w-0 group-hover:w-12 ${feature.bg.replace("bg-", "bg-").replace("/10", "/60")} rounded-full transition-all duration-500`}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default FeaturesSection;
