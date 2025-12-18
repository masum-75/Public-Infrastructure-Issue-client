import React from 'react';
import HomeBannerSlider from './HomeBannerSlider'; 
import LatestResolvedIssues from './LatestResolvedIssues'; 
import FeaturesSection from './FeaturesSection'; 
import HowItWorksSection from './HowItWorksSection'; 
import WhyChooseUs from './WhyChooseUs';
import Newsletter from './Newsletter';

const Home = () => {
    return (
        <div className='min-h-screen bg-slate-900'> 
            
            <HomeBannerSlider />
            
            <section className="py-24 md:py-32 bg-[#0f172a] border-b border-slate-800">
                <div className="container mx-auto px-6">
                    <FeaturesSection />
                </div>
            </section>

            <section className="py-24 md:py-32 bg-slate-100 text-slate-900">
                <div className="container mx-auto px-6">
                    <LatestResolvedIssues />
                </div>
            </section>
            
            <section className="py-24 md:py-32 bg-indigo-950 text-white">
                <div className="container mx-auto px-6">
                    <HowItWorksSection />
                </div>
            </section>
            
            <section className="py-24 md:py-32 bg-slate-200">
                <div className="container mx-auto px-6">
                    <WhyChooseUs />
                </div>
            </section>

            <section className="py-24 pb-40 bg-slate-900">
                <div className="container mx-auto px-6">
                    <Newsletter />
                </div>
            </section>
        </div>
    );
};

export default Home;