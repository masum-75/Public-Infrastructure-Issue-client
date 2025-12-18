import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Shared/Navbar'; 
import Footer from '../components/Shared/Footer'; 

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#020617]"> 
            
            <Navbar /> 
            
           
            <main className="flex-grow overflow-x-hidden">
                <Outlet />
            </main>
            
            <Footer />
        </div>
    );
};

export default MainLayout;