import React from 'react';
import { Fa1, Fa2, Fa3, Fa4 } from 'react-icons/fa6';

const steps = [
    { icon: Fa1, title: "Report", description: "Citizen spots an issue and submits a report via the website." },
    { icon: Fa2, title: "Review & Assign", description: "Admin verifies the report and assigns it to the relevant Staff team." },
    { icon: Fa3, title: "Resolve", description: "Staff addresses the issue and updates the status to 'Resolved'." },
    { icon: Fa4, title: "Verify", description: "Citizen is notified, and the community benefits from the fix." },
];

const HowItWorksSection = () => (
    <section className="py-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-4 text-primary">How It Works</h2>
        <p className="text-center text-gray-600 mb-12">Our simple 4-step process ensures quick and transparent action.</p>
        
        <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl">
                {steps.map((step, index) => (
                    <div key={index} className="text-center relative p-6">
                        <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold shadow-lg">
                            <step.icon />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-gray-700 text-sm">{step.description}</p>
                        
                        {index < steps.length - 1 && (
                            <div className="hidden md:block absolute top-8 right-[-24px] w-12 border-t-2 border-dashed border-gray-400"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default HowItWorksSection;