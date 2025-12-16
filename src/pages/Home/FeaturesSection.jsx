import React from 'react';
import { FaPencilAlt, FaRegEye, FaTachometerAlt } from 'react-icons/fa';

const features = [
    { icon: FaPencilAlt, title: "Easy Reporting", description: "Submit an issue report with a photo and location in under a minute." },
    { icon: FaRegEye, title: "Transparent Tracking", description: "Follow your report's status: Pending, In-Progress, or Resolved." },
    { icon: FaTachometerAlt, title: "Priority Boosting", description: "Boost critical issues to the top of the queue with a small payment." },
];

const FeaturesSection = () => (
    <section className="py-20 bg-base-100">
        <h2 className="text-4xl font-bold text-center mb-4 text-primary">Core Features</h2>
        <p className="text-center text-gray-600 mb-12">Empowering citizens to drive municipal improvement.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
                <div key={index} className="text-center p-6 bg-white shadow-xl rounded-lg transform hover:scale-[1.02] transition duration-300">
                    <feature.icon className="text-6xl text-secondary mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-700">{feature.description}</p>
                </div>
            ))}
        </div>
    </section>
);

export default FeaturesSection;