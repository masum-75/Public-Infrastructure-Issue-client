import React from 'react';
import { Link } from 'react-router';

const Logo = ({ className = "w-10 h-10", textSize = "text-xl" }) => {
    return (
        <Link to="/" className="flex items-center gap-2 group">
            
            <img 
                src="/logo.png" 
                alt="PublicIssue Logo" 
                className={`${className} transition-transform group-hover:scale-110 duration-300`} 
            />
            
           
            <span className={`${textSize} font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent tracking-tight`}>
                PublicIssue
            </span>
        </Link>
    );
};

export default Logo;