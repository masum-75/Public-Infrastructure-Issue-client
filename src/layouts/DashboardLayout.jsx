import React from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router";
import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";

import { 
  FaHome, FaListAlt, FaTicketAlt, FaUserCircle, FaUsers, 
  FaChartLine, FaWallet, FaSignOutAlt, FaRegListAlt, FaClipboardCheck, FaMapMarkedAlt, FaChevronRight 
} from "react-icons/fa";
import Swal from "sweetalert2"; 

const DashboardLayout = () => {
  const { role, roleLoading } = useRole();
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "Successfully logged out!",
          timer: 1500,
          showConfirmButton: false,
          background: '#0f172a',
          color: '#fff'
        });
        navigate("/"); 
      })
      .catch((err) => console.error("Logout Error:", err));
  };

  if (roleLoading) return (
    <div className="h-screen flex justify-center items-center bg-[#020617]">
      <span className="loading loading-infinity loading-lg text-blue-500"></span>
    </div>
  );

  
  const navStyles = ({ isActive }) => 
    `flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl transition-all duration-300 group ${
      isActive 
      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30 translate-x-2' 
      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
    }`;

  return (
    <div className="drawer lg:drawer-open font-sans bg-[#020617]">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      
     
      <div className="drawer-content flex flex-col bg-[#020617] min-h-screen">
        <header className="flex lg:hidden items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
           <Link to="/" className="text-xl font-black text-white italic">CITY<span className="text-blue-500">CARE</span></Link>
           <label htmlFor="my-drawer-2" className="btn btn-ghost btn-sm text-white border border-slate-700">Menu</label>
        </header>
        
        <main className="p-4 md:p-10 lg:p-12">
           <Outlet />
        </main>
      </div>


      <div className="drawer-side z-[100]">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <div className="bg-[#0f172a] w-80 min-h-full border-r border-slate-800 p-6 flex flex-col shadow-2xl">
          
          
          <div className="mb-10 p-4 rounded-2xl bg-gradient-to-br from-slate-800/50 to-transparent border border-slate-700/50">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                   <img src="https://i.ibb.co/C2G7Q7r/logo.png" alt="Logo" className="w-8 h-8 brightness-0 invert" />
                </div>
                <div className="flex flex-col">
                   <span className="text-xl font-black text-white tracking-tighter italic uppercase">CITYCARE</span>
                   <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {role || 'User'} Panel
                   </span>
                </div>
             </div>
          </div>

          
          <ul className="space-y-2 flex-grow overflow-y-auto custom-scrollbar pr-2 text-sm">
            
            {role === "admin" && (
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 ml-4 mb-3 uppercase tracking-[0.2em]">Management</p>
                <li><NavLink to="/dashboard/admin-home" className={navStyles}><div className="flex items-center gap-3"><FaChartLine className="text-blue-400"/> Overview</div> <FaChevronRight className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"/></NavLink></li>
                <li><NavLink to="/dashboard/all-issues-admin" className={navStyles}><div className="flex items-center gap-3"><FaListAlt className="text-indigo-400"/> All Issues</div></NavLink></li>
                <li><NavLink to="/dashboard/manage-users" className={navStyles}><div className="flex items-center gap-3"><FaUsers className="text-emerald-400"/> Citizens</div></NavLink></li>
                <li><NavLink to="/dashboard/manage-staff" className={navStyles}><div className="flex items-center gap-3"><FaClipboardCheck className="text-amber-400"/> Staff Force</div></NavLink></li>
                <li><NavLink to="/dashboard/payments-admin" className={navStyles}><div className="flex items-center gap-3"><FaWallet className="text-rose-400"/> Financials</div></NavLink></li>
              </div>
            )}

            {role === "staff" && (
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 ml-4 mb-3 uppercase tracking-[0.2em]">Operations</p>
                <li><NavLink to="/dashboard/staff-home" className={navStyles}><div className="flex items-center gap-3"><FaChartLine className="text-blue-400"/> Stats Overview</div></NavLink></li>
                <li><NavLink to="/dashboard/assigned-issues" className={navStyles}><div className="flex items-center gap-3"><FaRegListAlt className="text-orange-400"/> Task Board</div></NavLink></li>
              </div>
            )}

            {role === "citizen" && (
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 ml-4 mb-3 uppercase tracking-[0.2em]">Reporting</p>
                <li><NavLink to="/dashboard/citizen-home" className={navStyles}><div className="flex items-center gap-3"><FaChartLine className="text-blue-400"/> My Activity</div></NavLink></li>
                <li><NavLink to="/dashboard/my-issues" className={navStyles}><div className="flex items-center gap-3"><FaTicketAlt className="text-indigo-400"/> History</div></NavLink></li>
                <li><NavLink to="/dashboard/report-issue" className={navStyles}><div className="flex items-center gap-3"><FaMapMarkedAlt className="text-emerald-400"/> New Report</div></NavLink></li>
              </div>
            )}

            <div className="h-px bg-slate-800 my-8 mx-4"></div>

            <li><NavLink to="/dashboard/profile" className={navStyles}><div className="flex items-center gap-3"><FaUserCircle className="text-slate-400"/> Profile Settings</div></NavLink></li>
            <li><Link to="/" className="flex items-center gap-3 px-5 py-3.5 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-all"><FaHome className="text-slate-500"/> Exit to Home</Link></li>
          </ul>

         
          <div className="mt-auto pt-6 border-t border-slate-800">
            <button 
              onClick={handleLogOut} 
              className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-red-500/10 text-red-500 font-black uppercase text-[11px] tracking-widest hover:bg-red-500 hover:text-white transition-all duration-500 active:scale-95 shadow-lg shadow-red-500/5 group"
            >
              <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" /> Terminate Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;