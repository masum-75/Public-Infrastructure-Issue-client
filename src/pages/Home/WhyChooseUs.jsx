import React from 'react';

import { FaShieldAlt, FaChartLine, FaClock, FaUsers } from 'react-icons/fa';

const WhyChooseUs = () => {
    const features = [
        { id: 1, title: "High Transparency", desc: "Every action is recorded in the issue timeline for public audit.", icon: FaShieldAlt, color: "text-blue-500", bg: "bg-blue-50" },
        { id: 2, title: "Data Driven", desc: "We help authorities analyze infrastructure data for better planning.", icon: FaChartLine, color: "text-green-500", bg: "bg-green-50" },
        { id: 3, title: "Rapid Response", desc: "Automated staff assignment reduces response time significantly.", icon: FaClock, color: "text-amber-500", bg: "bg-amber-50" },
        { id: 4, title: "Citizen Focused", desc: "Premium support and real-time tracking for every reporter.", icon: FaUsers, color: "text-purple-500", bg: "bg-purple-50" },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-gray-900">Making City Life Better</h2>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">Our system bridges the gap between citizens and authorities through technology.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f) => (
                        <div key={f.id} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
                            <div className={`w-16 h-16 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform`}>
                                <f.icon />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{f.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;