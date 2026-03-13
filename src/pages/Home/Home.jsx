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
import '../../index.css';

const SectionWrapper = ({ children, className = '' }) => (
    <section className={`py-8 md:py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
            {children}
        </div>
    </section>
);

const Home = () => {
    return (
        <div className="">

            {/* 1. Hero / Banner Slider */}
            <HomeBannerSlider />

            {/* 2. Live Stats Bar */}
            <div >
                <StatsSection />
            </div>

            {/* 3. Features Section */}
            <SectionWrapper >
                <FeaturesSection />
            </SectionWrapper>

            {/* 4. Issue Categories */}
            <SectionWrapper >
                <CategorySection />
            </SectionWrapper>

            {/* 5. How It Works */}
            <SectionWrapper >
                <HowItWorksSection />
            </SectionWrapper>

            {/* 6. Latest Resolved Issues */}
            <SectionWrapper >
                <LatestResolvedIssues />
            </SectionWrapper>

            {/* 7. Why Choose Us */}
            <SectionWrapper >
                <WhyChooseUs />
            </SectionWrapper>

            {/* 8. Testimonials */}
            <SectionWrapper >
                <TestimonialsSection />
            </SectionWrapper>

            {/* 9. FAQ */}
            <SectionWrapper >
                <FaqSection />
            </SectionWrapper>

            {/* 10. CTA Banner */}
            <CtaSection />

            {/* 11. Newsletter */}
            <SectionWrapper >
                <Newsletter />
            </SectionWrapper>

        </div>
    );
};

export default Home;