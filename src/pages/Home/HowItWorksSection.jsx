import React from 'react';
import { FaSearch, FaClipboardCheck, FaWrench, FaSmile, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router';

const steps = [
    {
        icon: FaSearch,
        step: '01',
        title: "Spot & Report",
        description: "Citizen spots an infrastructure issue and submits a report with photos, location, and details in under a minute.",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        glow: "shadow-blue-500/10",
    },
    {
        icon: FaClipboardCheck,
        step: '02',
        title: "Review & Assign",
        description: "Admin reviews and verifies the report, then assigns it to the relevant municipal staff team for action.",
        color: "text-indigo-400",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20",
        glow: "shadow-indigo-500/10",
    },
    {
        icon: FaWrench,
        step: '03',
        title: "Fix & Update",
        description: "Staff addresses the issue on-ground and updates the status with official notes and resolution details.",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        glow: "shadow-amber-500/10",
    },
    {
        icon: FaSmile,
        step: '04',
        title: "Verify & Celebrate",
        description: "Citizen is notified, can rate the resolution, and the whole community benefits from the improvement.",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        glow: "shadow-emerald-500/10",
    },
];

const HowItWorksSection = () => (
    <div>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-5">
                <FaWrench className="text-indigo-400 text-xs" />
                <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest">The Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                How It <span className="text-indigo-400">Works</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
                Our simple 4-step process ensures every issue is heard, assigned, fixed, and verified transparently.
            </p>
        </div>

        {/* Steps */}
        <div className="relative">
            {/* Connector line - desktop only */}
            <div className="hidden lg:block absolute top-14 left-0 right-0 h-px mx-auto w-3/4">
                <div className="w-full h-full border-t-2 border-dashed border-slate-700/60" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center text-center group">
                        {/* Icon circle */}
                        <div className={`relative w-28 h-28 ${step.bg} border-2 ${step.border} rounded-2xl flex items-center justify-center mb-6 shadow-xl ${step.glow} group-hover:scale-105 transition-transform duration-300`}>
                            <step.icon className={`text-3xl ${step.color}`} />
                            {/* Step number badge */}
                            <span className="absolute -top-3 -right-3 w-7 h-7 bg-slate-950 border border-slate-700 rounded-lg flex items-center justify-center text-xs font-black text-slate-400">
                                {step.step}
                            </span>
                        </div>

                        {/* Arrow connector for mobile/tablet */}
                        {index < steps.length - 1 && (
                            <div className="lg:hidden flex justify-center my-2">
                                <FaArrowRight className="text-slate-700 rotate-90" />
                            </div>
                        )}

                        <h3 className="text-lg font-bold text-white mb-2.5">{step.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-[200px]">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
            <Link
                to="/register"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
            >
                Get Started for Free
                <FaArrowRight className="text-xs" />
            </Link>
        </div>
    </div>
);

export default HowItWorksSection;