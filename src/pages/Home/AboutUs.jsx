import React from "react";
import {
  FaCheckCircle,
  FaUsers,
  FaMapMarkerAlt,
  FaAward,
  FaArrowRight,
} from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";
import { Link } from "react-router";

const stats = [
  {
    value: "12,400+",
    label: "Issues Reported",
    icon: MdOutlineReportProblem,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    value: "8,900+",
    label: "Issues Resolved",
    icon: FaCheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    value: "3,200+",
    label: "Active Citizens",
    icon: FaUsers,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    value: "3 Cities",
    label: "Across Bangladesh",
    icon: FaMapMarkerAlt,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

const highlights = [
  "Real-time status tracking for every report",
  "Direct coordination with municipal authorities",
  "Community upvotes to prioritize urgent issues",
  "Fully transparent resolution process",
  "Premium tools for high-priority issues",
];

const teamMembers = [
  {
    name: "Arif Rahman",
    role: "Founder & CEO",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
  },
  {
    name: "Nadia Islam",
    role: "Head of Operations",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
  },
  {
    name: "Rahul Hasan",
    role: "Lead Engineer",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
  },
];

const AboutUs = () => {
  return (
    <div className="bg-slate-950 text-white">
      {/* Hero Block */}
      <section className="py-24 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Text */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <FaAward className="text-blue-400 text-sm" />
                <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">
                  Est. 2024
                </span>
              </div>

              <h4 className="text-blue-400 font-bold uppercase tracking-widest text-sm">
                Who We Are
              </h4>

              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                Bridging the Gap Between{" "}
                <span className="text-blue-400">
                  Citizens &amp; Authorities
                </span>
              </h2>

              <p className="text-slate-400 leading-relaxed text-lg">
                Municipal services often suffer from delayed response and lack
                of accountability. CityCare empowers every resident to report
                broken streetlights, potholes, and sanitation issues — directly
                reaching the authorities who can fix them.
              </p>

              <p className="text-slate-500 leading-relaxed">
                Built on principles of transparency and community action, we've
                connected over 3,200 citizens with local authorities across 3
                major cities — and we're just getting started.
              </p>

              <ul className="space-y-3">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-slate-300 text-sm"
                  >
                    <FaCheckCircle className="text-emerald-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/all-issues"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
                >
                  View All Issues
                  <FaArrowRight className="text-xs" />
                </Link>
                <Link
                  to="/contact-us"
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white font-bold rounded-xl transition-all duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-3xl transform scale-110" />
              <div className="relative rounded-3xl overflow-hidden border border-slate-800/60">
                <img
                  src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=800"
                  alt="CityCare Team"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 shadow-xl">
                <p className="text-2xl font-black text-white">Est. 2024</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Digital City Service
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-slate-800/60 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, label, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="text-center p-6 bg-slate-900/60 border border-slate-800/50 rounded-2xl hover:border-slate-700 transition-colors"
              >
                <div
                  className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`text-xl ${color}`} />
                </div>
                <p className="text-3xl font-black text-white mb-1">{value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Our Mission &amp; <span className="text-blue-400">Vision</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              What drives us every day to build a better city platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-slate-900 border border-slate-800/60 rounded-3xl hover:border-blue-500/20 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <MdOutlineReportProblem className="text-blue-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-slate-400 leading-relaxed">
                To create a transparent, efficient, and community-driven
                platform that connects citizens with municipal authorities —
                ensuring every infrastructure issue is heard, tracked, and
                resolved.
              </p>
            </div>
            <div className="p-8 bg-slate-900 border border-slate-800/60 rounded-3xl hover:border-emerald-500/20 transition-colors group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <FaAward className="text-emerald-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-slate-400 leading-relaxed">
                To become Bangladesh's leading civic technology platform — a
                future where no pothole goes unnoticed, no broken streetlight
                stays dark, and every citizen has a voice in shaping their city.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Meet the <span className="text-blue-400">Team</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              The people building CityCare with passion for civic technology.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {teamMembers.map(({ name, role, img }) => (
              <div key={name} className="text-center group">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={img}
                    alt={name}
                    className="w-full h-full rounded-2xl object-cover border-2 border-slate-800 group-hover:border-blue-500/40 transition-colors"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors" />
                </div>
                <h4 className="font-bold text-white text-lg">{name}</h4>
                <p className="text-sm text-slate-500 font-medium">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
