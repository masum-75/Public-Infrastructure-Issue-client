import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaClock, FaHeadset } from 'react-icons/fa';
import { MdOutlineReportProblem } from 'react-icons/md';

const ContactUs = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Full name is required.';
        if (!form.email.trim()) errs.email = 'Email address is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email.';
        if (!form.subject.trim()) errs.subject = 'Subject is required.';
        if (!form.message.trim()) errs.message = 'Message cannot be empty.';
        else if (form.message.trim().length < 20) errs.message = 'Message must be at least 20 characters.';
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setLoading(false);
        setSubmitted(true);
    };

    const contactItems = [
        {
            icon: FaMapMarkerAlt,
            label: 'Our Office',
            value: 'Sector 10, Uttara, Dhaka, Bangladesh',
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
        },
        {
            icon: FaPhoneAlt,
            label: 'Phone',
            value: '+880 1234 567 890',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
        },
        {
            icon: FaEnvelope,
            label: 'Email',
            value: 'support@citycare.gov',
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
        },
        {
            icon: FaClock,
            label: 'Availability',
            value: 'Support available 24/7',
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
        },
    ];

    const fieldClass = (field) =>
        `w-full bg-slate-800/60 border rounded-xl px-5 text-white placeholder-slate-600 focus:outline-none transition-all duration-200 ${errors[field]
            ? 'border-red-500/70 focus:ring-2 focus:ring-red-500/30 focus:border-red-500'
            : 'border-slate-700/60 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 hover:border-slate-600'
        }`;

    return (
        <section className="min-h-screen bg-slate-950 py-24">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-5">
                        <FaHeadset className="text-blue-400 text-sm" />
                        <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">Support Team</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Get In <span className="text-blue-400">Touch</span>
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg">
                        Have a concern about city infrastructure? Our dedicated team is ready to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">

                    {/* Left Info Panel */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800/60 rounded-3xl p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <MdOutlineReportProblem className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="font-black text-white text-lg leading-tight">CITY<span className="text-blue-400">CARE</span></p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Public Infrastructure</p>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>

                            <div className="space-y-4">
                                {contactItems.map(({ icon: Icon, label, value, color, bg }) => (
                                    <div key={label} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/30 hover:border-slate-600/50 transition-colors">
                                        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                                            <Icon className={`text-sm ${color}`} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">{label}</p>
                                            <p className="text-sm text-slate-300 font-medium">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Response time badge */}
                        <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl flex items-center gap-3">
                            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-emerald-400">Average Response: ~2 hours</p>
                                <p className="text-xs text-slate-600 mt-0.5">We typically respond quickly during business hours</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Form Panel */}
                    <div className="lg:col-span-3 bg-slate-900 border border-slate-800/60 rounded-3xl p-8 md:p-10">

                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-16">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                                    <FaCheckCircle className="text-emerald-400 text-4xl" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                                <p className="text-slate-400 max-w-sm mb-8">
                                    Thank you for reaching out. Our team will get back to you within 2 hours.
                                </p>
                                <button
                                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
                                >
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold text-white mb-8">Send Us a Message</h3>
                                <form onSubmit={handleSubmit} noValidate className="space-y-5">

                                    {/* Name & Email row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className={`${fieldClass('name')} h-12`}
                                            />
                                            {errors.name && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                className={`${fieldClass('email')} h-12`}
                                            />
                                            {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.email}</p>}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            placeholder="Issue regarding street lights..."
                                            className={`${fieldClass('subject')} h-12`}
                                        />
                                        {errors.subject && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.subject}</p>}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            placeholder="Describe how we can help you..."
                                            rows={5}
                                            className={`${fieldClass('message')} py-4 resize-none`}
                                        />
                                        <div className="flex justify-between items-center mt-1.5">
                                            {errors.message
                                                ? <p className="text-red-400 text-xs font-medium">{errors.message}</p>
                                                : <span />
                                            }
                                            <span className={`text-xs font-medium ml-auto ${form.message.length < 20 ? 'text-slate-600' : 'text-emerald-400'}`}>
                                                {form.message.length} / 20 min
                                            </span>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center justify-center gap-3 w-full md:w-auto px-10 h-13 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane className="text-sm" />
                                                Send Inquiry
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;