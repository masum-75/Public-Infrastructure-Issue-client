import React, { useEffect, useRef, useState } from 'react';
import { FaCheckCircle, FaUsers, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const useCountUp = (target, duration = 2000, start = false) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
};

const STATS = [
    {
        icon: FaMapMarkerAlt,
        value: 12400,
        suffix: '+',
        label: 'Issues Reported',
        sub: 'By engaged citizens',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/15',
        glow: 'shadow-blue-500/10',
    },
    {
        icon: FaCheckCircle,
        value: 8900,
        suffix: '+',
        label: 'Issues Resolved',
        sub: 'By our staff force',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/15',
        glow: 'shadow-emerald-500/10',
    },
    {
        icon: FaUsers,
        value: 3200,
        suffix: '+',
        label: 'Active Citizens',
        sub: 'Across the city',
        color: 'text-violet-400',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/15',
        glow: 'shadow-violet-500/10',
    },
    {
        icon: FaClock,
        value: 48,
        suffix: 'h',
        label: 'Avg. Resolution',
        sub: 'From report to fix',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/15',
        glow: 'shadow-amber-500/10',
    },
];

const StatCard = ({ stat, index, visible }) => {
    const count = useCountUp(stat.value, 2000 + index * 200, visible);
    const { icon: Icon, suffix, label, sub, color, bg, border, glow } = stat;

    return (
        <div
            className={`relative p-8 bg-slate-900 border ${border} rounded-3xl shadow-xl ${glow} group hover:-translate-y-1 transition-all duration-300`}
            style={{ transitionDelay: `${index * 80}ms` }}
        >
            {/* Top icon */}
            <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`text-xl ${color}`} />
            </div>

            {/* Counter */}
            <div className="flex items-end gap-1 mb-2">
                <span className={`text-5xl font-black tabular-nums ${color}`}>
                    {count.toLocaleString()}
                </span>
                <span className={`text-3xl font-black ${color} mb-1`}>{suffix}</span>
            </div>

            <p className="text-white font-bold text-lg leading-tight">{label}</p>
            <p className="text-slate-500 text-sm font-medium mt-1">{sub}</p>

            {/* Subtle bottom glow line */}
            <div className={`absolute bottom-0 left-6 right-6 h-px ${bg.replace('/10', '/40')} rounded-full`} />
        </div>
    );
};

const StatsSection = () => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Grid bg */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

            {/* Blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-600/5 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Heading */}
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-5">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                        By the Numbers
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Real impact,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                            measurable results
                        </span>
                    </h2>
                    <p className="text-slate-400 mt-5 text-lg max-w-xl mx-auto">
                        Every number represents a citizen heard, a problem fixed, and a city made better.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((stat, i) => (
                        <StatCard key={stat.label} stat={stat} index={i} visible={visible} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;