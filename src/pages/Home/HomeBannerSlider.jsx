import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion'; 
import { useNavigate } from 'react-router';
import { FaArrowRight, FaMapMarkedAlt, FaLightbulb, FaTools } from 'react-icons/fa';

// CSS Imports
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const slides = [
    { 
        id: 1, 
        title: "Fixing Our Streets Together", 
        subtitle: "Report potholes, broken pavements, and road hazards in seconds. Your voice drives city repairs.", 
        bg: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1600', 
        icon: <FaTools className='text-yellow-400' />,
        action: 'Report an Issue',
        link: '/dashboard/report-issue'
    },
    { 
        id: 2, 
        title: "Illuminating Every Corner", 
        subtitle: "Broken streetlights? Report them now and help us make our neighborhoods safer at night.", 
        bg: 'https://images.unsplash.com/photo-1473111583944-f9c15e74948e?q=80&w=1600', 
        icon: <FaLightbulb className='text-yellow-300' />,
        action: 'Track Issues',
        link: '/all-issues'
    },
    { 
        id: 3, 
        title: "A Smarter, Cleaner City", 
        subtitle: "From garbage overflow to water leaks—be the change your community needs today.", 
        bg: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1600', 
        icon: <FaMapMarkedAlt className='text-green-400' />,
        action: 'Join the Movement',
        link: '/register'
    },
];

const HomeBannerSlider = () => {
    const navigate = useNavigate();
    
    return (
        <div className="h-[60vh] md:h-[85vh] w-full relative group overflow-hidden">
            <Swiper
                effect={'fade'} 
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation={true}
                loop={true}
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                className="mySwiper h-full w-full"
            >
                {slides.map(slide => (
                    <SwiperSlide key={slide.id}>
                        <div 
                            className="w-full h-full bg-cover bg-center flex items-center justify-center relative"
                            style={{ backgroundImage: `url(${slide.bg})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                            
                            <div className="relative z-10 text-left container mx-auto px-6 md:px-12">
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="max-w-3xl"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-4xl md:text-5xl">{slide.icon}</span>
                                        <div className="h-1 w-20 bg-primary"></div>
                                    </div>
                                    
                                    <h1 className="text-4xl md:text-7xl font-black text-white leading-tight mb-6">
                                        {slide.title}
                                    </h1>
                                    
                                    <p className="text-lg md:text-2xl text-gray-200 font-medium mb-10 max-w-2xl leading-relaxed">
                                        {slide.subtitle}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-4">
                                        <button 
                                            onClick={() => navigate(slide.link)}
                                            className="btn btn-primary btn-lg rounded-full px-10 text-white border-none shadow-lg hover:scale-105 transition-transform group"
                                        >
                                            {slide.action} 
                                            <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                                        </button>
                                        
                                        <button 
                                            onClick={() => navigate('/all-issues')}
                                            className="btn btn-outline btn-lg rounded-full px-10 text-white border-white hover:bg-white hover:text-black transition-all"
                                        >
                                            Learn More
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

           
            <style jsx global>{`
                .swiper-button-next, .swiper-button-prev {
                    color: white !important;
                    background: rgba(255,255,255,0.1);
                    width: 50px !important;
                    height: 50px !important;
                    border-radius: 50%;
                    backdrop-filter: blur(5px);
                }
                .swiper-button-next:after, .swiper-button-prev:after {
                    font-size: 20px !important;
                    font-weight: bold;
                }
                .swiper-pagination-bullet-active {
                    background: #3B82F6 !important; /* Your Primary Color */
                    width: 30px !important;
                    border-radius: 5px !important;
                }
            `}</style>
        </div>
    );
};

export default HomeBannerSlider;