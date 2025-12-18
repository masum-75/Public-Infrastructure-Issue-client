import React from 'react';
import { FaPencilAlt, FaRegEye, FaTachometerAlt } from 'react-icons/fa';

const features = [
    { 
        icon: FaPencilAlt, 
        title: "Easy Reporting", 
        description: "Submit an issue report with a photo and location in under a minute. Quick and simple process.",
        color: "bg-pink-100 text-pink-600"
    },
    { 
        icon: FaRegEye, 
        title: "Transparent Tracking", 
        description: "Follow your report's status in real-time: Pending, In-Progress, or Resolved with updates.",
        color: "bg-blue-100 text-blue-600"
    },
    { 
        icon: FaTachometerAlt, 
        title: "Priority Boosting", 
        description: "Boost critical issues to the top of the queue with a small payment for faster resolution.",
        color: "bg-purple-100 text-purple-600"
    },
];

const FeaturesSection = () => (
    <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                    Core <span className="text-primary">Features</span>
                </h2>
                <div className="h-1.5 w-20 bg-primary mx-auto rounded-full mb-6"></div>
                <p className="text-lg text-slate-600 font-medium">
                    Empowering citizens to drive municipal improvement through transparency and technology.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {features.map((feature, index) => (
                    <div 
                        key={index} 
                        className="group relative p-10 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                    >
                        <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 ${feature.color}`}></div>
                        
                        <div className="relative z-10">
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-8 transition-transform duration-500 group-hover:rotate-6 ${feature.color}`}>
                                <feature.icon />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            
                            <p className="text-slate-600 leading-relaxed text-base font-medium">
                                {feature.description}
                            </p>
                        </div>

                        <div className="mt-8 flex items-center text-primary font-bold text-sm cursor-pointer">
                            READ MORE <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default FeaturesSection;