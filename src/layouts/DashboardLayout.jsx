import React from "react";
import { Outlet } from "react-router";
import useRole from "../hooks/useRole";
import {
  FaHome,
  FaListAlt,
  FaTicketAlt,
  FaUserCircle,
  FaUsers,
  FaChartLine,
  FaWallet,
  FaBan,
  FaRegListAlt,
  FaClipboardCheck,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { Link, NavLink } from "react-router";
import useAuth from "../hooks/useAuth";
// import Logo from "../components/Logo/Logo"; 

const DashboardLayout = () => {
  const { role, roleLoading } = useRole();
  const { logOut } = useAuth();

  if (roleLoading) {
    return (
      <span className="loading loading-infinity loading-xl block mx-auto mt-20"></span>
    );
  }

  const handleLogOut = () => {
    logOut()
      .then(() => console.log("Logged out"))
      .catch((err) => console.error(err));
  };

 
  const getDashboardLinks = () => {
    if (role === "admin") {
      return (
        <>
          <li>
            <NavLink to="/dashboard/admin-home">
              <FaChartLine /> Admin Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/all-issues-admin">
              <FaListAlt /> All Issues
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-users">
              <FaUsers /> Manage Citizens
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-staff">
              <FaClipboardCheck /> Manage Staff
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/payments-admin">
              <FaWallet /> Payments History
            </NavLink>
          </li>
        </>
      );
    } else if (role === "staff") {
      return (
        <>
          <li>
            <NavLink to="/dashboard/staff-home">
              <FaChartLine /> Staff Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/assigned-issues">
              <FaRegListAlt /> Assigned Issues
            </NavLink>
          </li>
        </>
      );
    } else {
      // Citizen role
      return (
        <>
          <li>
            <NavLink to="/dashboard/citizen-home">
              <FaChartLine /> Citizen Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/my-issues">
              <FaTicketAlt /> My Reported Issues
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/report-issue">
              <FaMapMarkedAlt /> Report New Issue
            </NavLink>
          </li>
        </>
      );
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col p-8 bg-gray-50 min-h-screen">
        {/* Page Content */}
        <label htmlFor="my-drawer-2" className="btn btn-primary lg:hidden mb-4">
          Open Sidebar
        </label>
        <Outlet />
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <li className="text-xl font-bold mb-4 flex justify-center py-2 border-b border-gray-300">
            <Link to="/">
              <Logo /> DASHBOARD
            </Link>
          </li>

          {getDashboardLinks()}

          <div className="divider"></div>

          {/* Common Links */}
          <li>
            <NavLink to="/dashboard/profile">
              <FaUserCircle /> Profile
            </NavLink>
          </li>
          <li>
            <Link to="/">
              <FaHome /> Back to Home
            </Link>
          </li>
          <li>
            <button onClick={handleLogOut} className="btn-ghost justify-start">
              <FaBan /> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
