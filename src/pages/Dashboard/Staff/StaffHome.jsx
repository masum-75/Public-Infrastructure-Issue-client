import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaClipboardList, FaCheck, FaTools } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCardStaff = ({ title, value, icon: Icon, color }) => (
    <div className={`card shadow-lg bg-white border-b-4 border-${color}-500`}>
        <div className="card-body p-4 flex-row items-center justify-between">
            <div>
                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="text-gray-500">{title}</p>
            </div>
            <Icon className={`text-4xl text-${color}-500 opacity-70`} />
        </div>
    </div>
);

const StaffHome = () => {
    const axiosSecure = useAxiosSecure();

    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['staffStats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/dashboard/staff/stats');
            return res.data;
        }
    });

    if (isLoading) {
        return <span className="loading loading-infinity loading-xl block mx-auto mt-20"></span>;
    }
    
   
    const chartData = stats.dailyResolved?.map(item => ({
        name: new Date(item._id).toLocaleDateString(),
        Resolved: item.resolvedCount,
    })).reverse() || []; 

    return (
        <div className='p-4 space-y-8'>
            <h2 className="text-4xl font-bold text-primary">Staff Dashboard Overview</h2>

          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCardStaff title="Total Assigned" value={stats.totalAssigned || 0} icon={FaClipboardList} color="blue" />
                <StatCardStaff title="In Progress" value={stats.inProgressCount || 0} icon={FaTools} color="warning" />
                <StatCardStaff title="Issues Resolved" value={stats.resolvedCount || 0} icon={FaCheck} color="green" />
            </div>

          
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Weekly Resolution Performance</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Resolved" stroke="#22c55e" activeDot={{ r: 8 }} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StaffHome;