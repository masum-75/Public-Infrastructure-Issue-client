import { createBrowserRouter } from "react-router";
import MainLayout from '../layouts/MainLayout'; 
import Home from "../pages/Home/Home";

import NotFound from '../pages/NotFound/NotFound';
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import DashboardLayout from '../layouts/DashboardLayout';
import PrivateRoutes from "./PrivateRoutes";
import { AdminRoute, StaffRoute } from "./RoleBasedRoutes";

// Citizen Dashboard Pages
import CitizenHome from "../pages/Dashboard/Citizen/CitizenHome";
import MyIssues from "../pages/Dashboard/Citizen/MyIssues";
import ReportIssue from "../pages/Dashboard/Citizen/ReportIssue";

// Staff Dashboard Pages
import StaffHome from "../pages/Dashboard/Staff/StaffHome";
import AssignedIssues from "../pages/Dashboard/Staff/AssignedIssues";

// Admin Dashboard Pages
import AdminHome from "../pages/Dashboard/Admin/AdminHome";
import AllIssuesAdmin from "../pages/Dashboard/Admin/AllIssuesAdmin";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageStaff from "../pages/Dashboard/Admin/ManageStaff";
import PaymentsAdmin from "../pages/Dashboard/Admin/PaymentsAdmin";

// Common Pages
import Profile from "../pages/Dashboard/Common/Profile";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import PaymentCancelled from "../pages/Payment/PaymentCancelled";
import AllIssuesPublic from "../pages/AllIssues/AllIssuesPublic";
import IssueDetails from "../pages/AllIssues/IssueDetails";
import ContactUs from "../pages/Home/ContactUs";
import AboutUs from "../pages/Home/AboutUs";




export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout></MainLayout>,
        errorElement: <NotFound />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "all-issues",
                element: <AllIssuesPublic />,
            },
            {
                path: "issue/:id",
                
                element: <PrivateRoutes><IssueDetails /></PrivateRoutes>, 
            },
            { path: "about-us", element: <AboutUs /> },
            { path: "Contact-us", element: <ContactUs /> },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "dashboard/payment-success",
                element: <PaymentSuccess />, 
            },
            {
                path: "dashboard/payment-cancelled",
                element: <PaymentCancelled />,
            },
        ],
    },
    {
        path: "/dashboard",
        element: <PrivateRoutes><DashboardLayout /></PrivateRoutes>,
        children: [

            {
                path: "citizen-home",
                element: <CitizenHome />, 
            },
            {
                path: "my-issues",
                element: <MyIssues />,
            },
            {
                path: "report-issue",
                element: <ReportIssue />,
            },
            
       
            {
                path: "staff-home",
                element: <StaffRoute><StaffHome /></StaffRoute>,
            },
            {
                path: "assigned-issues",
                element: <StaffRoute><AssignedIssues /></StaffRoute>,
            },
            
          
            {
                path: "admin-home",
                element: <AdminRoute><AdminHome /></AdminRoute>,
            },
            {
                path: "all-issues-admin",
                element: <AdminRoute><AllIssuesAdmin /></AdminRoute>,
            },
            {
                path: "manage-users",
                element: <AdminRoute><ManageUsers /></AdminRoute>,
            },
            {
                path: "manage-staff",
                element: <AdminRoute><ManageStaff /></AdminRoute>,
            },
            {
                path: "payments-admin",
                element: <AdminRoute><PaymentsAdmin /></AdminRoute>,
            },

           
            {
                path: "profile",
                element: <Profile />,
            },
        ],
    }
]);