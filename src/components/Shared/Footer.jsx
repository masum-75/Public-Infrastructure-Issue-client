import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer p-10 bg-neutral text-neutral-content mt-12">
            
            <aside>
                <img src="https://i.ibb.co/C2G7Q7r/logo.png" alt="Logo" className="w-10 h-10 mb-3" />
                <p className="text-lg font-bold">CivicFix Ltd.</p>
                <p className='text-sm'>Providing reliable infrastructure management since 2024.</p>
                <div className="flex space-x-4 mt-4">
                    <a href="#" className='text-2xl hover:text-primary'><FaFacebook /></a>
                    <a href="#" className='text-2xl hover:text-primary'><FaTwitter /></a>
                    <a href="#" className='text-2xl hover:text-primary'><FaInstagram /></a>
                </div>
            </aside>
            
            <nav>
                <h6 className="footer-title">Services</h6>
                <a className="link link-hover">Issue Reporting</a>
                <a className="link link-hover">Status Tracking</a>
                <a className="link link-hover">Priority Boost</a>
                <a className="link link-hover">Community Support</a>
            </nav>
            
            <nav>
                <h6 className="footer-title">Company</h6>
                <a className="link link-hover">About Us</a>
                <a className="link link-hover">Careers</a>
                <a className="link link-hover">Privacy Policy</a>
                <a className="link link-hover">Terms of Use</a>
            </nav>
            
            <nav>
                <h6 className="footer-title">Contact Us</h6>
                <p className="flex items-center link link-hover"><FaMapMarkerAlt className='mr-2' /> 123 Main St, Cityville</p>
                <p className="flex items-center link link-hover"><FaPhone className='mr-2' /> +880 1XXXXXXXXX</p>
                <p className="flex items-center link link-hover"><FaEnvelope className='mr-2' /> support@civicfix.com</p>
            </nav>
            
        </footer>
    );
};

export default Footer;