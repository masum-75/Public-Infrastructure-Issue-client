import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaTicketAlt, FaCheckCircle, FaHourglassHalf, FaCrown } from 'react-icons/fa';

const CitizenHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

   
    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['citizen-stats', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/dashboard/citizen-stats/${user?.email}`);
            return res.data;
        }
    });

    if (isLoading) return <span className="loading loading-dots loading-lg"></span>;

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold">Welcome back, {user?.displayName}!</h1>
                {stats?.isPremium && <div className="badge badge-secondary p-4 gap-2"><FaCrown /> Premium Member</div>}
            </div>

           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="stat bg-blue-100 rounded-xl shadow">
                    <div className="stat-figure text-blue-500"><FaTicketAlt className="text-3xl" /></div>
                    <div className="stat-title">Total Reported</div>
                    <div className="stat-value">{stats?.totalReported || 0}</div>
                </div>
                
                <div className="stat bg-orange-100 rounded-xl shadow">
                    <div className="stat-figure text-orange-500"><FaHourglassHalf className="text-3xl" /></div>
                    <div className="stat-title">Pending Issues</div>
                    <div className="stat-value">{stats?.pendingCount || 0}</div>
                </div>

                <div className="stat bg-green-100 rounded-xl shadow">
                    <div className="stat-figure text-green-500"><FaCheckCircle className="text-3xl" /></div>
                    <div className="stat-title">Resolved Issues</div>
                    <div className="stat-value">{stats?.resolvedCount || 0}</div>
                </div>
            </div>

      
            <div className="bg-base-200 p-8 rounded-2xl border-2 border-dashed border-primary/30">
                <h2 className="text-xl font-semibold mb-4 text-primary">Report a New Infrastructure Problem</h2>
                <p className="mb-6">Is there a pothole, broken streetlight, or garbage overflow in your area? Reporting helps our staff address issues faster.</p>
                <button className="btn btn-primary text-black">Report an Issue Now</button>
            </div>
        </div>
    );
};

export default CitizenHome;