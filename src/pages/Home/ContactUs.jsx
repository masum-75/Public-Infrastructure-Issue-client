import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const ContactUs = () => {
    return (
        <section className="py-24 bg-[#020617]">
            <div className="container mx-auto px-6">
                
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Get In Touch</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Have a specific concern about city infrastructure? Reach out to our dedicated support team.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto bg-[#0f172a] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-800">
                    
                    <div className="md:w-1/3 bg-blue-600 p-12 text-white relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        
                        <h3 className="text-3xl font-bold mb-10 relative z-10">Contact Info</h3>
                        
                        <div className="space-y-10 relative z-10">
                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <FaMapMarkerAlt className="text-xl" />
                                </div>
                                <div>
                                    <p className="font-black text-blue-100 uppercase text-xs tracking-widest mb-1">Our Office</p>
                                    <p className="text-white font-medium">Sector 10, Uttara, <br />Dhaka, Bangladesh</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <FaPhoneAlt className="text-xl" />
                                </div>
                                <div>
                                    <p className="font-black text-blue-100 uppercase text-xs tracking-widest mb-1">Phone</p>
                                    <p className="text-white font-medium">+880 1234 567 890</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <FaEnvelope className="text-xl" />
                                </div>
                                <div>
                                    <p className="font-black text-blue-100 uppercase text-xs tracking-widest mb-1">Email</p>
                                    <p className="text-white font-medium">support@civicfix.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 opacity-30 text-xs font-bold uppercase tracking-[0.3em]">
                            Available 24/7
                        </div>
                    </div>

                    <div className="md:w-2/3 p-8 md:p-16 bg-slate-900">
                        <h3 className="text-3xl font-bold text-white mb-8">Send Us a Message</h3>
                        
                        <form className="grid grid-cols-1 gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full bg-slate-800 border border-slate-700 rounded-xl h-14 px-5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                                    <input type="email" placeholder="john@example.com" className="w-full bg-slate-800 border border-slate-700 rounded-xl h-14 px-5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Subject</label>
                                <input type="text" placeholder="Issue regarding street lights" className="w-full bg-slate-800 border border-slate-700 rounded-xl h-14 px-5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Message</label>
                                <textarea placeholder="Describe how we can help..." className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-5 text-white h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"></textarea>
                            </div>

                            <button className="group relative w-full md:w-max px-10 h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 overflow-hidden shadow-xl shadow-blue-900/20">
                                <span className="relative z-10">Send Inquiry</span>
                                <FaPaperPlane className="text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;