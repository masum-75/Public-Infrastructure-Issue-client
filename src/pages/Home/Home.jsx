import React from 'react';
import HomeBannerSlider from './HomeBannerSlider';
import LatestResolvedIssues from './LatestResolvedIssues';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import WhyChooseUs from './WhyChooseUs';
import Newsletter from './Newsletter';
import StatsSection from './StatsSection';
import CategorySection from './CategorySection';
import TestimonialsSection from './TestimonialsSection';
import FaqSection from './FaqSection';
import CtaSection from './CtaSection';

const SectionWrapper = ({ children, className = '' }) => (
    <section className={`py-20 md:py-28 ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
            {children}
        </div>
    </section>
);

const Home = () => {
    return (
        <div className="bg-slate-950 min-h-screen">

            {/* 1. Hero / Banner Slider */}
            <HomeBannerSlider />

            {/* 2. Live Stats Bar */}
            <div className="bg-slate-900/60 border-y border-slate-800/60">
                <StatsSection />
            </div>

            {/* 3. Features Section */}
            <SectionWrapper className="bg-slate-950">
                <FeaturesSection />
            </SectionWrapper>

            {/* 4. Issue Categories */}
            <SectionWrapper className="bg-slate-900/40 border-y border-slate-800/40">
                <CategorySection />
            </SectionWrapper>

            {/* 5. How It Works */}
            <SectionWrapper className="bg-slate-950">
                <HowItWorksSection />
            </SectionWrapper>

            {/* 6. Latest Resolved Issues */}
            <SectionWrapper className="bg-slate-900/40 border-y border-slate-800/40">
                <LatestResolvedIssues />
            </SectionWrapper>

            {/* 7. Why Choose Us */}
            <SectionWrapper className="bg-slate-950">
                <WhyChooseUs />
            </SectionWrapper>

            {/* 8. Testimonials */}
            <SectionWrapper className="bg-slate-900/40 border-y border-slate-800/40">
                <TestimonialsSection />
            </SectionWrapper>

            {/* 9. FAQ */}
            <SectionWrapper className="bg-slate-950">
                <FaqSection />
            </SectionWrapper>

            {/* 10. CTA Banner */}
            <CtaSection />

            {/* 11. Newsletter */}
            <SectionWrapper className="bg-slate-950 pb-32">
                <Newsletter />
            </SectionWrapper>

        </div>
    );
};

export default Home;