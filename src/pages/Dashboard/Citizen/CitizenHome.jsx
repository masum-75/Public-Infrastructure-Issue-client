import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaTicketAlt, FaCheckCircle, FaHourglassHalf, FaCrown } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const CitizenHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['citizen-stats', user?.email],
        queryFn: async () => {
            // নিশ্চিত করুন আপনার ব্যাকএন্ডে এই রাউটটি ঠিক আছে
            const res = await axiosSecure.get(`/dashboard/citizen-stats/${user?.email}`);
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <span className="loading loading-dots loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
                <h1 className="text-4xl font-extrabold text-gray-800">Welcome back, {user?.displayName}!</h1>
                {stats?.isPremium && (
                    <div className="badge badge-secondary badge-lg p-5 gap-2 shadow-md">
                        <FaCrown className="text-yellow-400" /> Premium Member
                    </div>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <div className="stat bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="stat-figure text-blue-500 bg-blue-50 p-3 rounded-full"><FaTicketAlt className="text-2xl" /></div>
                    <div className="stat-title font-semibold text-gray-500">Total Reported</div>
                    <div className="stat-value text-blue-600">{stats?.totalIssues || 0}</div>
                </div>
                
                <div className="stat bg-white border border-orange-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="stat-figure text-orange-500 bg-orange-50 p-3 rounded-full"><FaHourglassHalf className="text-2xl" /></div>
                    <div className="stat-title font-semibold text-gray-500">Pending Issues</div>
                    <div className="stat-value text-orange-600">{stats?.pendingIssues || 0}</div>
                </div>

                <div className="stat bg-white border border-green-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="stat-figure text-green-500 bg-green-50 p-3 rounded-full"><FaCheckCircle className="text-2xl" /></div>
                    <div className="stat-title font-semibold text-gray-500">Resolved Issues</div>
                    <div className="stat-value text-green-600">{stats?.resolvedIssues || 0}</div>
                </div>
            </div>

            {/* Action Card */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-10 rounded-3xl border-2 border-dashed border-primary/30 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold mb-3 text-primary">Found a new infrastructure problem?</h2>
                    <p className="text-gray-600 max-w-xl">Whether it's a pothole, broken streetlight, or garbage overflow, reporting helps our staff address issues faster and keep the city clean.</p>
                </div>
                <button 
                    onClick={() => navigate('/dashboard/report-issue')}
                    className="btn btn-primary btn-lg shadow-xl px-8 text-black hover:scale-105 transition-transform"
                >
                    Report an Issue Now
                </button>
            </div>
        </div>
    );
};

export default CitizenHome;