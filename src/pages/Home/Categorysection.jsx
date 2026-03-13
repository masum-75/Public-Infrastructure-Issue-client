import React from 'react';
import { Link } from 'react-router';
import {
  FaRoad,
  FaLightbulb,
  FaTint,
  FaTrash,
  FaTree,
  FaBolt,
  FaArrowRight,
} from "react-icons/fa";

import { FaPersonWalking } from "react-icons/fa6";
import { MdConstruction } from "react-icons/md";

const CATEGORIES = [
    {
        icon: FaRoad,
        label: 'Pothole',
        count: '1.2k+',
        desc: 'Road damage & surface hazards',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/15',
        hover: 'hover:border-orange-500/40',
    },
    {
        icon: FaLightbulb,
        label: 'Streetlight',
        count: '840+',
        desc: 'Broken or flickering street lamps',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/15',
        hover: 'hover:border-yellow-500/40',
    },
    {
        icon: FaTint,
        label: 'Water Leakage',
        count: '630+',
        desc: 'Pipe bursts & flooding spots',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/15',
        hover: 'hover:border-blue-500/40',
    },
    {
        icon: FaTrash,
        label: 'Garbage Overflow',
        count: '2.1k+',
        desc: 'Uncollected waste & dumping',
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/15',
        hover: 'hover:border-green-500/40',
    },
    {
        icon: MdConstruction,
        label: 'Damaged Footpath',
        count: '780+',
        desc: 'Broken tiles & unsafe walkways',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/15',
        hover: 'hover:border-red-500/40',
    },
    {
        icon: FaTree,
        label: 'Fallen Tree',
        count: '290+',
        desc: 'Hazardous fallen branches & trees',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/15',
        hover: 'hover:border-emerald-500/40',
    },
    {
        icon: FaBolt,
        label: 'Power Outage',
        count: '510+',
        desc: 'Electrical faults & outages',
        color: 'text-violet-400',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/15',
        hover: 'hover:border-violet-500/40',
    },
    {
        icon: FaRoad,
        label: 'Other Issues',
        count: '1.5k+',
        desc: 'Any infrastructure problem',
        color: 'text-slate-400',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/15',
        hover: 'hover:border-slate-500/40',
        isOther: true,
    },
];

const CategorySection = () => (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                <div>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest mb-5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        Issue Categories
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        What can you<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                            report today?
                        </span>
                    </h2>
                </div>
                <Link
                    to="/all-issues"
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-white font-bold rounded-2xl transition-all duration-200 text-sm self-start md:self-auto shrink-0"
                >
                    Browse All Issues <FaArrowRight className="text-xs" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {CATEGORIES.map(({ icon: Icon, label, count, desc, color, bg, border, hover, isOther }) => (
                    <Link
                        key={label}
                        to={`/all-issues?category=${encodeURIComponent(label)}`}
                        className={`group relative p-6 bg-slate-950/60 border ${border} ${hover} rounded-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4`}
                    >
                        <div className="flex items-start justify-between">
                            <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className={`text-lg ${color}`} />
                            </div>
                            <span className={`text-[10px] font-black ${color} bg-opacity-10 px-2 py-1 ${bg} rounded-lg tabular-nums`}>
                                {count}
                            </span>
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm mb-1">{label}</p>
                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{desc}</p>
                        </div>
                        <div className={`absolute bottom-0 left-4 right-4 h-px ${bg.replace('/10', '/40')} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </Link>
                ))}
            </div>
        </div>
    </section>
);

export default CategorySection;