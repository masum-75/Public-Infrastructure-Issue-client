import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FaTicketAlt, FaSearchLocation, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const slides = [
    { 
        id: 1, 
        title: "Report Issues Instantly", 
        subtitle: "See a problem? Report it in 60 seconds.", 
        bg: 'https://i.ibb.co/5cQf1qg/road-repair.jpg', 
        icon: <FaTicketAlt className='text-5xl text-white mb-4' />,
        action: 'Report Now',
        link: '/dashboard/report-issue'
    },
    { 
        id: 2, 
        title: "Track Progress Live", 
        subtitle: "Monitor your issue status from Pending to Resolution.", 
        bg: 'https://i.ibb.co/gR3G4vX/street-lights.jpg', 
        icon: <FaSearchLocation className='text-5xl text-white mb-4' />,
        action: 'View All Issues',
        link: '/all-issues'
    },
    { 
        id: 3, 
        title: "Build a Better Community", 
        subtitle: "Your reports drive civic action and improvement.", 
        bg: 'https://i.ibb.co/L5rK5Q1/city-infrastructure.jpg', // City infrastructure image
        icon: <FaCheckCircle className='text-5xl text-white mb-4' />,
        action: 'Get Started',
        link: '/register'
    },
];

const HomeBannerSlider = () => {
    const navigate = useNavigate();
    
    return (
        <div className="h-[85vh] w-full relative">
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
                loop={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper h-full"
            >
                {slides.map(slide => (
                    <SwiperSlide key={slide.id}>
                        <div 
                            className="w-full h-full bg-cover bg-center flex items-center justify-center relative"
                            style={{ backgroundImage: `url(${slide.bg})` }}
                        >
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-primary/70 backdrop-brightness-50"></div>
                            
                            {/* Content */}
                            <div className="relative text-center text-white max-w-3xl p-6">
                                {slide.icon}
                                <h1 className="text-6xl font-extrabold mb-4">{slide.title}</h1>
                                <p className="text-xl font-light mb-8">{slide.subtitle}</p>
                                <button 
                                    onClick={() => navigate(slide.link)}
                                    className="btn btn-secondary btn-lg text-black hover:bg-yellow-500 shadow-2xl transition duration-300"
                                >
                                    {slide.action}
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HomeBannerSlider;