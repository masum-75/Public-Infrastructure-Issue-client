import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#050816] text-slate-300 pt-24 overflow-hidden">
            
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-20">
                
                {/* Brand Section */}
                <aside className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                            <img src="https://i.ibb.co/C2G7Q7r/logo.png" alt="Logo" className="w-10 h-10 brightness-0 invert" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter italic uppercase">
                            CITY<span className="text-blue-500">CARE</span>
                        </span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400 font-medium">
                        Revolutionizing municipal management. Reporting infrastructure issues with 100% transparency and community-driven action.
                    </p>
                    <div className="flex space-x-4">
                        {[FaFacebook, FaTwitter, FaInstagram].map((Icon, index) => (
                            <a key={index} href="#" className='w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 shadow-xl group'>
                                <Icon className="text-xl group-hover:text-white" />
                            </a>
                        ))}
                    </div>
                </aside>
                
                <nav className="flex flex-col space-y-5">
                    <h6 className="text-white font-bold text-sm uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">Solutions</h6>
                    {['Issue Reporting', 'Status Tracking', 'Priority Boost', 'Community Hub'].map((item) => (
                        <Link key={item} className="text-slate-400 hover:text-white transition-all flex items-center gap-2 group text-sm">
                            <FaChevronRight className="text-[10px] text-blue-500 group-hover:translate-x-1 transition-transform" /> {item}
                        </Link>
                    ))}
                </nav>
                
                <nav className="flex flex-col space-y-5">
                    <h6 className="text-white font-bold text-sm uppercase tracking-[0.2em] border-l-4 border-indigo-600 pl-3">Support</h6>
                    {['Help Center', 'Safety & Security', 'Privacy Policy', 'Terms of Use'].map((item) => (
                        <Link key={item} className="text-slate-400 hover:text-white transition-all flex items-center gap-2 group text-sm">
                            <FaChevronRight className="text-[10px] text-indigo-500 group-hover:translate-x-1 transition-transform" /> {item}
                        </Link>
                    ))}
                </nav>
                
                <nav className="flex flex-col space-y-6">
                    <h6 className="text-white font-bold text-sm uppercase tracking-[0.2em] border-l-4 border-emerald-500 pl-3">Contact</h6>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                        <div className="flex items-start gap-4">
                            <FaMapMarkerAlt className='text-emerald-500 mt-1 text-lg' /> 
                            <span className="text-sm">123 Smart City, <br />Dhaka, Bangladesh</span>
                        </div>
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <FaPhone className='text-emerald-500 text-lg group-hover:scale-110 transition-transform' /> 
                            <span className="text-sm">+880 1XXXXXXXXX</span>
                        </div>
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <FaEnvelope className='text-emerald-500 text-lg group-hover:scale-110 transition-transform' /> 
                            <span className="text-sm">hello@civicfix.com</span>
                        </div>
                    </div>
                </nav>
            </div>
            
            <div className="border-t border-slate-800/50 bg-[#020617]/80 backdrop-blur-sm py-10">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        © {currentYear} CivicFix Limited. Built for the community.
                    </p>
                    <div className="flex gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">Server Status</a>
                        <a href="#" className="hover:text-white transition-colors">API Docs</a>
                        <a href="#" className="hover:text-white transition-colors">System Updates</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;