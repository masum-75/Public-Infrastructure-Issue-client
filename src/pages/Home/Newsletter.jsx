import React, { useState } from 'react';
import { FaPaperPlane, FaEnvelopeOpenText } from 'react-icons/fa';
import Swal from 'sweetalert2'; 

const Newsletter = () => {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
           
            Swal.fire({
                icon: 'success',
                title: 'Subscribed!',
                text: 'Thank you for staying with CivicFix.',
                confirmButtonColor: '#2563eb'
            });
            setEmail("");
        }
    };

    return (
        <section className="relative py-8 px-4 overflow-hidden">
           
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-700 to-indigo-900 -z-10 rounded-[40px]"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center text-white">
                <div className="bg-white/20 p-4 rounded-2xl mb-6 backdrop-blur-md">
                    <FaEnvelopeOpenText className="text-4xl" />
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                    Stay in the <span className="text-blue-300">Loop</span>
                </h2>
                
                <p className="text-lg md:text-xl opacity-80 mb-10 max-w-xl font-medium leading-relaxed">
                    Join 5,000+ citizens getting real-time updates on community resolutions and news.
                </p>

                <form 
                    onSubmit={handleSubscribe}
                    className="flex flex-col sm:flex-row w-full max-w-lg gap-3 p-2 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20"
                >
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address" 
                        className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-white placeholder:text-blue-200 focus:ring-0" 
                    />
                    <button 
                        type="submit"
                        className="btn bg-white hover:bg-blue-50 text-blue-700 border-none rounded-2xl px-8 font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg"
                    >
                        Subscribe <FaPaperPlane className="text-xs" />
                    </button>
                </form>
                
                <p className="mt-6 text-sm opacity-60">
                    We value your privacy. Unsubscribe at any time.
                </p>
            </div>
        </section>
    );
};

export default Newsletter;