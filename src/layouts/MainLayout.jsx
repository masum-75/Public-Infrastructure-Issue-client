import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Shared/Navbar'; 
import Footer from '../components/Shared/Footer'; 

const MainLayout = () => {
    return (
        <div>
            
            <Navbar /> 
            
           
            <div className="min-h-[calc(100vh-250px)]">
                <Outlet />
            </div>
            
            
            <Footer />
        </div>
    );
};

export default MainLayout;