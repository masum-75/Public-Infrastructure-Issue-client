import React from 'react';
import { Link, NavLink } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import { FaUserCircle, FaCrown, FaSignOutAlt, FaUserEdit, FaThLarge } from 'react-icons/fa';

const Navbar = () => {
    const { user, logOut } = useAuth();
    const { isPremium, role } = useRole();

    const navItems = (
        <>
            <li><NavLink to="/" className={({ isActive }) => isActive ? "text-blue-500 font-bold underline decoration-2 underline-offset-8 transition-all" : "hover:text-blue-400 transition-colors"}>Home</NavLink></li>
            <li><NavLink to="/all-issues" className={({ isActive }) => isActive ? "text-blue-500 font-bold underline decoration-2 underline-offset-8 transition-all" : "hover:text-blue-400 transition-colors"}>All Issues</NavLink></li>
            <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-blue-500 font-bold underline decoration-2 underline-offset-8 transition-all" : "hover:text-blue-400 transition-colors"}>Dashboard</NavLink></li>
            <li><NavLink to="/about-us" className={({ isActive }) => isActive ? "text-blue-500 font-bold underline decoration-2 underline-offset-8 transition-all" : "hover:text-blue-400 transition-colors"}>About Us</NavLink></li>
            <li><NavLink to="/contact-us" className={({ isActive }) => isActive ? "text-blue-500 font-bold underline decoration-2 underline-offset-8 transition-all" : "hover:text-blue-400 transition-colors"}>Contact Us</NavLink></li>
        </>
    );

    const userDropdown = (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar ring-2 ring-blue-500/50 hover:ring-blue-500 transition-all p-0.5">
                <div className="w-10 rounded-full bg-slate-800">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || "User"} />
                    ) : (
                        <FaUserCircle className="w-full h-full text-slate-400 p-1" />
                    )}
                </div>
            </label>
            <ul tabIndex={0} className="menu dropdown-content mt-4 z-[100] p-4 shadow-2xl bg-slate-900 border border-slate-700 rounded-2xl w-72 text-slate-200">
                <li className='px-4 py-4 mb-2 bg-slate-800/50 rounded-xl'>
                    <div className='flex flex-col items-start gap-1 p-0'>
                        <div className='flex items-center gap-2 w-full'>
                            <span className="font-black text-lg text-white truncate">{user?.displayName || 'User'}</span>
                            {isPremium && <FaCrown className='text-amber-400 animate-pulse' title="Premium Member" />}
                        </div>
                        <span className='text-xs font-bold uppercase tracking-widest text-blue-400'>{role} Access</span>
                        <span className='text-[10px] text-slate-500 italic truncate w-full'>{user?.email}</span>
                    </div>
                </li>
                <li><Link to="/dashboard" className="flex items-center gap-3 py-3 hover:bg-slate-800 rounded-lg transition-all"><FaThLarge className="text-blue-400" /> My Dashboard</Link></li>
                <li><Link to="/dashboard/profile" className="flex items-center gap-3 py-3 hover:bg-slate-800 rounded-lg transition-all"><FaUserEdit className="text-emerald-400" /> Edit Profile</Link></li>
                <li className="mt-2 pt-2 border-t border-slate-700">
                    <button onClick={logOut} className="flex items-center gap-3 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all">
                        <FaSignOutAlt /> Sign Out
                    </button>
                </li>
            </ul>
        </div>
    );

    return (
        <nav className="navbar bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-[1000] px-4 md:px-8">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden text-white mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-4 z-[100] p-4 shadow-2xl bg-slate-900 border border-slate-800 rounded-2xl w-64 text-slate-200 gap-2">
                        {navItems}
                        {!user && <li><Link to="/login" className="btn btn-primary btn-sm mt-4">Login</Link></li>}
                    </ul>
                </div>
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 bg-blue-600 rounded-lg group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                        <img src="https://i.ibb.co/C2G7Q7r/logo.png" alt="Logo" className="w-7 h-7 brightness-0 invert" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">CITY<span className="text-blue-500">CARE</span></span>
                </Link>
            </div>
            
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 font-bold text-slate-300 gap-8">
                    {navItems}
                </ul>
            </div>
            
            <div className="navbar-end gap-4">
                {user ? (
                    userDropdown
                ) : (
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="btn btn-ghost text-white font-bold hidden sm:flex hover:bg-slate-800">Login</Link>
                        <Link to="/register" className="btn bg-blue-600 border-none hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 px-6 rounded-xl">
                            Join Now
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;