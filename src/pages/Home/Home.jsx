import React from 'react';
import HomeBannerSlider from './HomeBannerSlider'; 
import LatestResolvedIssues from './LatestResolvedIssues'; 
import FeaturesSection from './FeaturesSection'; 
import HowItWorksSection from './HowItWorksSection'; 



const Home = () => {
    return (
        <div className='min-h-screen'>
            {/* 1. Banner Section (Slider) */}
            <HomeBannerSlider />
            
            <div className="container mx-auto px-4">
                {/* 2. Features Section */}
                <FeaturesSection />
                
                {/* 3. Latest Resolved Issues */}
                <LatestResolvedIssues />
                
                {/* 4. How It Works Section */}
                <HowItWorksSection />
                
                {/* 5. Extra Sections */}
                
            </div>
        </div>
    );
};

export default Home;