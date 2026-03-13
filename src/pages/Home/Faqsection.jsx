import React, { useState } from "react";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router";

const FAQS = [
  {
    q: "How do I report an infrastructure issue?",
    a: 'Simply create a free account, navigate to "Report Issue" from your dashboard, fill in the title, category, location, description, and attach a photo. Your report will be submitted instantly and assigned to the relevant authorities.',
  },
  {
    q: "How many issues can I report for free?",
    a: "Free (Standard) accounts can submit up to 3 reports. For unlimited reporting, priority status, and exclusive features, upgrade to our Premium plan for just 1,000 Taka.",
  },
  {
    q: "How long does it take for an issue to be resolved?",
    a: "Our average resolution time is 48 hours. This depends on the severity and category of the issue. High-priority issues are escalated immediately to the relevant department.",
  },
  {
    q: "Can I track the status of my report?",
    a: 'Yes! From your citizen dashboard, you can view real-time status updates for every report you\'ve submitted — from "Pending" through "In-Progress" to "Resolved" or "Closed".',
  },
  {
    q: "What happens after I submit a report?",
    a: "Your report enters our system and is reviewed by a CityCare admin. A qualified staff member is then assigned to investigate and resolve the issue. You'll receive status updates throughout the process.",
  },
  {
    q: "Is my personal information kept private?",
    a: "Absolutely. Your email and personal details are never shared publicly. Only the issue content and location are visible to staff and admins. We take data privacy seriously.",
  },
  {
    q: "What types of issues can I report?",
    a: "You can report potholes, broken streetlights, water leakages, garbage overflow, damaged footpaths, fallen trees, power outages, and any other public infrastructure problem in your city.",
  },
  {
    q: "How do I cancel or edit a report?",
    a: 'Reports in "Pending" status can be edited or deleted from your "My Reports" dashboard page. Once a report is assigned to staff (In-Progress or beyond), it can no longer be modified.',
  },
];

const FaqItem = ({ item, isOpen, onToggle }) => (
  <div
    className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
      isOpen
        ? "bg-slate-900 border-blue-500/30"
        : " border-slate-800/60"
    }`}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left"
    >
      <span
        className={`text-sm font-bold leading-snug transition-colors ${isOpen ? "text-white" : "text-white"}`}
      >
        {item.q}
      </span>
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
          isOpen ? "bg-blue-500/20 text-blue-400 rotate-180" : " text-white"
        }`}
      >
        <FaChevronDown className="text-xs" />
      </div>
    </button>

    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
    >
      <p className="px-7 pb-6 text-white text-lg leading-relaxed border-t border-slate-800/60 pt-4">
        {item.a}
      </p>
    </div>
  </div>
);

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const half = Math.ceil(FAQS.length / 2);
  const left = FAQS.slice(0, half);
  const right = FAQS.slice(half);

  return (
    <section className="py-24  relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-xs font-bold uppercase tracking-widest mb-5">
            <FaQuestionCircle className="text-[11px]" />
            Common Questions
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Everything you
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
              need to know
            </span>
          </h2>
          <p className="text-slate-400 mt-5 text-lg max-w-xl mx-auto">
            Have more questions? Reach out via our contact page.
          </p>
        </div>

        {/* Two-column FAQ grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            {left.map((item, i) => (
              <FaqItem
                key={i}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>
          <div className="space-y-3">
            {right.map((item, i) => (
              <FaqItem
                key={i + half}
                item={item}
                isOpen={openIndex === i + half}
                onToggle={() =>
                  setOpenIndex(openIndex === i + half ? -1 : i + half)
                }
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-white text-lg mb-4">Still have questions?</p>
          <Link
            to="/contact-us"
            className="inline-flex items-center gap-2 px-7 py-3.5   hover:bg-slate-700 border border-slate-700 hover:border-slate-600 bg-sky-400 text-black hover:text-white font-bold rounded-2xl transition-all duration-200 text-lg"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
