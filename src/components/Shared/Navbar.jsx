import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import {
    FaUserCircle, FaCrown, FaSignOutAlt,
    FaUserEdit, FaThLarge, FaBell, FaBars, FaTimes
} from 'react-icons/fa';
import { MdOutlineReportProblem } from 'react-icons/md';
import ThemeToggle from '../../contexts/Themecontext/Themetoggle';


const Navbar = () => {
    const { user, logOut } = useAuth();
    const { isPremium, role } = useRole();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const baseLink = "relative text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full";
    const activeLink = "relative text-sm font-semibold text-white after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-500";

    const publicLinks = [
        { to: "/", label: "Home" },
        { to: "/all-issues", label: "All Issues" },
        { to: "/about-us", label: "About Us" },
        { to: "/contact-us", label: "Contact" },
    ];

    const authLinks = user
        ? [...publicLinks, { to: "/dashboard", label: "Dashboard" }]
        : publicLinks;

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${scrolled
                ? 'bg-slate-950/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-slate-800/60'
                : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                            <div className="relative">
                                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform duration-300">
                                    <MdOutlineReportProblem className="text-white text-xl" />
                                </div>
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
                            </div>
                            <div className="hidden sm:flex flex-col leading-none">
                                <span className="text-xl font-black tracking-tight text-white">
                                    CITY<span className="text-blue-400">CARE</span>
                                </span>
                                <span className="text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase">Public Infrastructure</span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <ul className="hidden lg:flex items-center gap-8">
                            {authLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <NavLink
                                        to={to}
                                        className={({ isActive }) => isActive ? activeLink : baseLink}
                                    >
                                        {label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">

                            {/* ── Theme Toggle ── */}
                            <ThemeToggle></ThemeToggle>

                            {user ? (
                                <>
                                    {/* Notification Bell */}
                                    <button className="relative w-9 h-9 rounded-xl bg-slate-800/70 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200">
                                        <FaBell className="text-base" />
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-1 ring-slate-950" />
                                    </button>

                                    {/* User Dropdown */}
                                    <div className="dropdown dropdown-end">
                                        <label tabIndex={0} className="flex items-center gap-2.5 cursor-pointer group">
                                            <div className="relative">
                                                <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-blue-500/40 group-hover:ring-blue-500 transition-all duration-200">
                                                    {user?.photoURL
                                                        ? <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                                        : <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                                            <span className="text-white font-bold text-sm">
                                                                {user?.displayName?.charAt(0) || 'U'}
                                                            </span>
                                                        </div>
                                                    }
                                                </div>
                                                {isPremium && (
                                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                                                        <FaCrown className="text-amber-900 text-[8px]" />
                                                    </span>
                                                )}
                                            </div>
                                            <div className="hidden md:block text-left">
                                                <p className="text-sm font-bold text-white leading-tight truncate max-w-[100px]">
                                                    {user?.displayName?.split(' ')[0] || 'User'}
                                                </p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                                                    {role}
                                                </p>
                                            </div>
                                        </label>

                                        <ul tabIndex={0} className="dropdown-content mt-3 z-[100] bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/40 w-72 p-2 overflow-hidden">
                                            {/* User Info Header */}
                                            <li className="px-4 py-4 mb-1 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl border border-blue-500/10">
                                                <div className="flex items-center gap-3 p-0">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-blue-500/30 shrink-0">
                                                        {user?.photoURL
                                                            ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                                                            : <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                                                <span className="text-white font-bold text-lg">
                                                                    {user?.displayName?.charAt(0) || 'U'}
                                                                </span>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-bold text-white truncate">{user?.displayName || 'User'}</span>
                                                            {isPremium && <FaCrown className="text-amber-400 shrink-0 text-xs" />}
                                                        </div>
                                                        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">{role}</span>
                                                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                                                    </div>
                                                </div>
                                            </li>

                                            <li>
                                                <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-150 text-sm font-medium">
                                                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                        <FaThLarge className="text-blue-400 text-sm" />
                                                    </span>
                                                    Dashboard
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-150 text-sm font-medium">
                                                    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                        <FaUserEdit className="text-emerald-400 text-sm" />
                                                    </span>
                                                    Edit Profile
                                                </Link>
                                            </li>
                                            <li className="mt-1 pt-1 border-t border-slate-800">
                                                <button
                                                    onClick={logOut}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-150 text-sm font-medium"
                                                >
                                                    <span className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                                        <FaSignOutAlt className="text-red-400 text-sm" />
                                                    </span>
                                                    Sign Out
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-all duration-200"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/35 hover:-translate-y-0.5"
                                    >
                                        Join Now
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Hamburger */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="lg:hidden w-9 h-9 rounded-xl bg-slate-800/70 border border-slate-700/50 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                            >
                                {mobileOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-slate-950/98 backdrop-blur-xl border-t border-slate-800/60 px-4 py-4 space-y-1">
                        {authLinks.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive
                                        ? 'text-white bg-blue-600/15 border border-blue-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}

                        {!user && (
                            <div className="flex gap-2 pt-3 mt-3 border-t border-slate-800">
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 py-2.5 text-center text-sm font-semibold text-slate-300 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all">
                                    Sign In
                                </Link>
                                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 py-2.5 text-center text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all">
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Spacer for fixed navbar */}
            <div className="h-16" />
        </>
    );
};

export default Navbar;