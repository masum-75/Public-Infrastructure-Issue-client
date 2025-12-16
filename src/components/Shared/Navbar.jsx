import React from 'react';
import { Link, NavLink } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import { FaUserCircle, FaCrown } from 'react-icons/fa';

const Navbar = () => {
    const { user, logOut } = useAuth();
    const { isPremium, role } = useRole();
    
   
    const navItems = (
        <>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/all-issues">All Issues</NavLink></li>
            <li><NavLink to="/community">Community Forum</NavLink></li>
            <li><NavLink to="/support">Support</NavLink></li>
        </>
    );

    
    const userDropdown = (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-primary">
                <div className="w-10 rounded-full">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || "User"} />
                    ) : (
                        <FaUserCircle className="w-full h-full text-gray-400" />
                    )}
                </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[10] p-4 shadow bg-base-100 rounded-box w-60 border">
                <li className='px-4 py-2 border-b'>
                    <div className='flex items-center justify-between'>
                        <span className="font-bold text-lg">{user?.displayName || 'User'}</span>
                        {isPremium && <FaCrown className='text-yellow-500' title="Premium" />}
                    </div>
                    <span className='text-sm text-gray-500 capitalize'>{role} Dashboard</span>
                </li>
                <li><Link to={`/dashboard/home`}>Dashboard</Link></li>
                <li><Link to="/dashboard/profile">Profile</Link></li>
                <li className="mt-2 pt-2 border-t"><button onClick={logOut}>Logout</button></li>
            </ul>
        </div>
    );

    return (
        <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navItems}
                        {!user && <li><Link to="/login">Login</Link></li>}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl font-extrabold text-primary">
                   
                    <img src="https://i.ibb.co/C2G7Q7r/logo.png" alt="Logo" className="w-8 h-8" />
                    CivicFix
                </Link>
            </div>
            
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 font-semibold space-x-2">
                    {navItems}
                </ul>
            </div>
            
            <div className="navbar-end">
                {user ? (
                    userDropdown
                ) : (
                    <Link to="/login" className="btn btn-primary text-black hover:bg-secondary">
                        Login / Register
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;