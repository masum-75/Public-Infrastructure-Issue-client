import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaChevronRight,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";
import { Link } from "react-router";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const solutions = [
    { label: "Report an Issue", to: "/all-issues" },
    { label: "Track My Reports", to: "/dashboard" },
    { label: "Community Upvotes", to: "/all-issues" },
    { label: "Premium Membership", to: "/dashboard/subscription" },
  ];

  const support = [
    { label: "Help Center", to: "/contact-us" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Use", to: "/terms" },
    { label: "About CityCare", to: "/about-us" },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  ];

  const stats = [
    { value: "12,400+", label: "Issues Reported" },
    { value: "8,900+", label: "Issues Resolved" },
    { value: "3,200+", label: "Active Citizens" },
    { value: "48h", label: "Avg. Response" },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Stats Bar */}
      <div className="border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-white mb-1">{value}</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <aside className="lg:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-300">
                <MdOutlineReportProblem className="text-white text-xl" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tight text-white">
                  CITY<span className="text-blue-400">CARE</span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-slate-600 uppercase">
                  Public Infrastructure
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-500">
              Bridging the gap between citizens and local authorities. Report,
              track, and resolve public infrastructure issues with full
              transparency.
            </p>

            <div className="flex items-center gap-2.5 p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0" />
              <span className="text-xs font-semibold text-emerald-400">
                All systems operational
              </span>
            </div>

            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:bg-blue-600 hover:border-blue-500 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </aside>

          {/* Solutions */}
          <nav className="space-y-5">
            <h6 className="text-white font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-0.5 bg-blue-500 rounded-full" />
              Solutions
            </h6>
            {solutions.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-all duration-200 group"
              >
                <FaChevronRight className="text-[9px] text-blue-500/50 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Support */}
          <nav className="space-y-5">
            <h6 className="text-white font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-0.5 bg-indigo-500 rounded-full" />
              Support
            </h6>
            {support.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-all duration-200 group"
              >
                <FaChevronRight className="text-[9px] text-indigo-500/50 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Contact */}
          <div className="space-y-5">
            <h6 className="text-white font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-0.5 bg-emerald-500 rounded-full" />
              Contact Us
            </h6>
            <div className="space-y-3">
              <a href="#" className="flex items-start gap-3 group">
                <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/40 transition-colors">
                  <FaMapMarkerAlt className="text-emerald-500 text-xs" />
                </span>
                <span className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors leading-snug">
                  123 Smart City Avenue,
                  <br />
                  Dhaka, Bangladesh
                </span>
              </a>
              <a
                href="tel:+8801XXXXXXXXX"
                className="flex items-center gap-3 group"
              >
                <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/40 transition-colors">
                  <FaPhone className="text-emerald-500 text-xs" />
                </span>
                <span className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors">
                  +880 1XXX-XXXXXX
                </span>
              </a>
              <a
                href="mailto:hello@citycare.gov"
                className="flex items-center gap-3 group"
              >
                <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/40 transition-colors">
                  <FaEnvelope className="text-emerald-500 text-xs" />
                </span>
                <span className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors">
                  hello@citycare.gov
                </span>
              </a>
            </div>

            <Link
              to="/contact-us"
              className="flex items-center gap-2 w-full px-4 py-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-sm font-semibold rounded-xl hover:bg-blue-600/20 hover:text-blue-300 transition-all duration-200 group"
            >
              <FaHeadset className="text-base" />
              Get Support
              <FaChevronRight className="text-xs ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/60 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
            <FaShieldAlt className="text-blue-500/50" />© {currentYear}{" "}
            CityCare. Built for the community.
          </p>
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Server Status
            </a>
            <span className="text-slate-800">•</span>
            <a href="#" className="hover:text-slate-300 transition-colors">
              API Docs
            </a>
            <span className="text-slate-800">•</span>
            <Link
              to="/privacy"
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
