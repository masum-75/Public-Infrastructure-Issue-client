import React from 'react';

const AboutUs = () => {
   return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=800" 
                            alt="About Our Mission" 
                            className="rounded-3xl shadow-2xl"
                        />
                        <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-2xl hidden md:block">
                            <p className="text-lg font-bold">Est. 2024</p>
                            <p className="text-sm">Digital City Service</p>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/2 space-y-6">
                    <h4 className="text-primary font-bold uppercase tracking-widest text-sm">Who We Are</h4>
                    <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                        Bridging the Gap Between Citizens & Authorities
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Municipal services often suffer from delayed response and lack of tracking. Our platform empowers you to report broken streetlights, potholes, and garbage issues directly to the authorities.
                    </p>
                    <div className="flex flex-wrap gap-4 mt-8">
                        <button className="btn btn-primary rounded-full px-8">Our Mission</button>
                        <button className="btn btn-outline rounded-full px-8">Read Success Stories</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;