import React from 'react';
import { Link } from 'react-router';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4 bg-base-200">
            <FaExclamationTriangle className="text-error text-8xl mb-6 animate-pulse" />
            <h1 className="text-7xl font-extrabold text-primary mb-4">404</h1>
            <h2 className="text-3xl font-bold mb-6 text-secondary">Page Not Found</h2>
            <p className="text-xl text-gray-600 mb-8">
                Oops! The URL you requested could not be found on our server.
            </p>
            <Link to="/" className="btn btn-primary text-black btn-lg shadow-lg">
                Go Back to Home
            </Link>
        </div>
    );
};

export default NotFound;