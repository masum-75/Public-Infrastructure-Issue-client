import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaQuoteLeft, FaCrown } from "react-icons/fa";

const TESTIMONIALS = [
  {
    name: "Arif Rahman",
    role: "Citizen · Dhaka",
    avatar: "AR",
    gradient: "from-blue-600 to-indigo-600",
    rating: 5,
    isPremium: true,
    text: "I reported a broken streetlight on my road and it was fixed within 36 hours! CityCare made the process incredibly simple — I just took a photo, filled in the location, and the staff handled the rest.",
  },
  {
    name: "Nusrat Jahan",
    role: "Citizen · Chittagong",
    avatar: "NJ",
    gradient: "from-violet-600 to-purple-600",
    rating: 5,
    isPremium: false,
    text: "The garbage overflow near our market was a months-long problem. After reporting it on CityCare, the authorities cleared it in two days. This platform is exactly what our city needed.",
  },
  {
    name: "Tariq Hassan",
    role: "Premium Member · Sylhet",
    avatar: "TH",
    gradient: "from-emerald-600 to-teal-600",
    rating: 5,
    isPremium: true,
    text: "Being a premium member lets me report unlimited issues and track each one in real-time. I've reported over 20 infrastructure problems in my area and almost all have been resolved. Brilliant service!",
  },
  {
    name: "Fatema Khatun",
    role: "Citizen · Rajshahi",
    avatar: "FK",
    gradient: "from-rose-600 to-pink-600",
    rating: 4,
    isPremium: false,
    text: "The pothole on Shahid Minar road was causing accidents every week. I submitted a report with photos and within 4 days it was patched. The timeline updates kept me informed throughout.",
  },
  {
    name: "Kamal Hossain",
    role: "Citizen · Comilla",
    avatar: "KH",
    gradient: "from-amber-600 to-orange-600",
    rating: 5,
    isPremium: true,
    text: "CityCare has genuinely changed how I interact with local government. The transparency, the fast response — it feels like someone is actually listening. Highly recommended for every citizen!",
  },
  {
    name: "Sabrina Islam",
    role: "Citizen · Khulna",
    avatar: "SI",
    gradient: "from-cyan-600 to-blue-600",
    rating: 5,
    isPremium: false,
    text: "Our neighbourhood had a water leakage issue for weeks. CityCare connected us with the right authorities and it was fixed promptly. The app is intuitive and the staff are responsive.",
  },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={`text-xs ${i < rating ? "text-amber-400" : "text-slate-700"}`}
      />
    ))}
  </div>
);

const TestimonialCard = ({ t }) => (
  <div className="flex-shrink-0 w-80 sm:w-96 p-7 bg-slate-900 border border-slate-800/60 rounded-3xl flex flex-col gap-5 hover:border-slate-700/60 transition-colors duration-300 group">
    <div className="flex items-start justify-between">
      <FaQuoteLeft className="text-slate-700 text-2xl group-hover:text-slate-600 transition-colors" />
      <StarRating rating={t.rating} />
    </div>
    <p className="text-slate-300 text-sm leading-relaxed flex-grow">
      "{t.text}"
    </p>
    <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center shrink-0`}
      >
        <span className="text-white font-black text-sm">{t.avatar}</span>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-white font-bold text-sm truncate">{t.name}</p>
          {t.isPremium && (
            <FaCrown className="text-amber-400 text-[10px] shrink-0" />
          )}
        </div>
        <p className="text-slate-500 text-xs">{t.role}</p>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pos = 0;
    const speed = 0.6;
    let raf;

    const step = () => {
      if (!paused) {
        pos += speed;
        const half = track.scrollWidth / 2;
        if (pos >= half) pos = 0;
        track.style.transform = `translateX(-${pos}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  return (
    <section className="py-24 bg-slate-950 overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-violet-600/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-14 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">
          <FaStar className="text-[10px]" />
          Citizen Voices
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Trusted by thousands of
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
            engaged citizens
          </span>
        </h2>
        <p className="text-slate-400 mt-5 text-lg max-w-xl mx-auto">
          Real stories from people who've used CityCare to improve their
          neighbourhoods.
        </p>
      </div>

      {/* Scrolling track */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-5 py-4 w-max"
            style={{ willChange: "transform" }}
          >
            {doubled.map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
