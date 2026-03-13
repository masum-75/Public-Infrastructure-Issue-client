import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
    FaArrowRight,
    FaMapMarkedAlt,
    FaLightbulb,
    FaTools,
    FaChevronDown,
} from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slides = [
    {
        id: 1,
        tag: "Road Safety",
        title: "Fixing Our Streets",
        titleHighlight: "Together",
        subtitle:
            "Report potholes, broken pavements, and road hazards in seconds. Your voice drives city repairs.",
        bg: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1600",
        icon: FaTools,
        iconColor: "text-amber-400",
        iconBg: "bg-amber-400/10",
        action: "Report an Issue",
        link: "/dashboard/report-issue",
        stats: [
            { value: "2,400+", label: "Roads Fixed" },
            { value: "48h", label: "Avg Response" },
        ],
    },
    {
        id: 2,
        tag: "Street Lighting",
        title: "Illuminating",
        titleHighlight: "Every Corner",
        subtitle:
            "Broken streetlights? Report them now and help us make our neighborhoods safer at night.",
        bg: "https://images.unsplash.com/photo-1473111583944-f9c15e74948e?q=80&w=1600",
        icon: FaLightbulb,
        iconColor: "text-yellow-300",
        iconBg: "bg-yellow-400/10",
        action: "Track Issues",
        link: "/all-issues",
        stats: [
            { value: "5,100+", label: "Lights Fixed" },
            { value: "92%", label: "Resolution Rate" },
        ],
    },
    {
        id: 3,
        tag: "Community Action",
        title: "A Smarter,",
        titleHighlight: "Cleaner City",
        subtitle:
            "From garbage overflow to water leaks — be the change your community needs today.",
        bg: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1600",
        icon: FaMapMarkedAlt,
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-400/10",
        action: "Join the Movement",
        link: "/register",
        stats: [
            { value: "12k+", label: "Citizens Active" },
            { value: "3 Cities", label: "Now Live" },
        ],
    },
];

const HomeBannerSlider = () => {
    const navigate = useNavigate();

    return (
        <div className="relative h-[65vh] md:h-[90vh] w-full overflow-hidden">
            <Swiper
                effect="fade"
                spaceBetween={0}
                centeredSlides
                autoplay={{ delay: 5500, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation
                loop
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                className="h-full w-full banner-swiper"
            >
                {slides.map((slide) => {
                    const IconComponent = slide.icon;
                    return (
                        <SwiperSlide key={slide.id}>
                            <div
                                className="w-full h-full bg-cover bg-center flex items-center relative"
                                style={{ backgroundImage: `url(${slide.bg})` }}
                            >
                                {/* Layered overlays */}
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-slate-950/10" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />

                                {/* Subtle grid pattern */}
                                <div
                                    className="absolute inset-0 opacity-[0.03]"
                                    style={{
                                        backgroundImage: `linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)`,
                                        backgroundSize: '40px 40px'
                                    }}
                                />

                                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
                                    <motion.div
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="max-w-2xl"
                                    >
                                        {/* Tag pill */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2, duration: 0.6 }}
                                            className="inline-flex items-center gap-2.5 mb-6"
                                        >
                                            <div className={`w-9 h-9 rounded-xl ${slide.iconBg} backdrop-blur-sm border border-white/10 flex items-center justify-center`}>
                                                <IconComponent className={`text-base ${slide.iconColor}`} />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-300">
                                                {slide.tag}
                                            </span>
                                            <span className="w-8 h-px bg-slate-500" />
                                        </motion.div>

                                        {/* Headline */}
                                        <motion.h1
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3, duration: 0.7 }}
                                            className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tighter"
                                        >
                                            {slide.title}{" "}
                                            <span className="text-blue-400">{slide.titleHighlight}</span>
                                        </motion.h1>

                                        {/* Subtitle */}
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.45, duration: 0.7 }}
                                            className="text-lg md:text-xl text-slate-300 mb-10 max-w-lg leading-relaxed"
                                        >
                                            {slide.subtitle}
                                        </motion.p>

                                        {/* CTA Buttons */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6, duration: 0.6 }}
                                            className="flex flex-wrap items-center gap-4 mb-12"
                                        >
                                            <button
                                                onClick={() => navigate(slide.link)}
                                                className="group flex items-center gap-2.5 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                                            >
                                                <MdOutlineReportProblem className="text-lg" />
                                                {slide.action}
                                                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                                            </button>

                                            <button
                                                onClick={() => navigate("/all-issues")}
                                                className="flex items-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/15 hover:border-white/30 text-white font-bold rounded-xl transition-all duration-200"
                                            >
                                                View All Issues
                                            </button>
                                        </motion.div>

                                        {/* Inline Stats */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.8, duration: 0.6 }}
                                            className="flex items-center gap-8"
                                        >
                                            {slide.stats.map(({ value, label }) => (
                                                <div key={label}>
                                                    <p className="text-2xl font-black text-white">{value}</p>
                                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</p>
                                                </div>
                                            ))}
                                            <div className="h-10 w-px bg-slate-700 mx-2" />
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                                <span className="text-xs font-semibold text-slate-400">Live Platform</span>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {/* Scroll hint */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 animate-bounce opacity-60">
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">Scroll</span>
                <FaChevronDown className="text-slate-400 text-xs" />
            </div>

            <style>{`
                .banner-swiper .swiper-button-next,
                .banner-swiper .swiper-button-prev {
                    color: white !important;
                    background: rgba(255, 255, 255, 0.07);
                    width: 44px !important;
                    height: 44px !important;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                    transition: all 0.2s;
                }
                .banner-swiper .swiper-button-next:hover,
                .banner-swiper .swiper-button-prev:hover {
                    background: rgba(59, 130, 246, 0.25);
                    border-color: rgba(59,130,246,0.4);
                }
                .banner-swiper .swiper-button-next::after,
                .banner-swiper .swiper-button-prev::after {
                    font-size: 16px !important;
                    font-weight: 900;
                }
                .banner-swiper .swiper-pagination-bullet {
                    background: rgba(255,255,255,0.3) !important;
                    opacity: 1;
                    transition: all 0.3s;
                }
                .banner-swiper .swiper-pagination-bullet-active {
                    background: #3b82f6 !important;
                    width: 24px !important;
                    border-radius: 4px !important;
                }
            `}</style>
        </div>
    );
};

export default HomeBannerSlider;