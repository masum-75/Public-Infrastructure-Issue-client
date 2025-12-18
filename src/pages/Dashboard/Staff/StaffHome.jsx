import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaClipboardList, FaCheck, FaTools, FaChartLine } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const StatCardStaff = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className={`relative overflow-hidden transition-all duration-300 hover:scale-105 rounded-2xl bg-white shadow-md border-l-8 border-${color}-500 p-6`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${bgColor} bg-opacity-20 text-${color}-600`}>
                <Icon className="text-3xl" />
            </div>
        </div>
        <div className={`absolute bottom-0 right-0 opacity-5 text-8xl -mb-4 -mr-4 text-${color}-900`}>
            <Icon />
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
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <span className="loading loading-bars loading-lg text-primary"></span>
                <p className="mt-4 text-gray-500 animate-pulse">Loading analytics...</p>
            </div>
        );
    }

    const chartData = stats.dailyResolved?.map(item => ({
        name: new Date(item._id).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        Resolved: item.resolvedCount,
    })) || [];

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">Staff Analytics</h2>
                    <p className="text-gray-500">Monitor your issue resolution progress and performance.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 border">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
                    <span className="text-sm font-semibold text-gray-700">Live Updates</span>
                </div>
            </header>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <StatCardStaff title="Total Assigned" value={stats.totalAssigned || 0} icon={FaClipboardList} color="blue" bgColor="bg-blue-100" />
                <StatCardStaff title="In Progress" value={stats.inProgressCount || 0} icon={FaTools} color="amber" bgColor="bg-amber-100" />
                <StatCardStaff title="Issues Resolved" value={stats.resolvedCount || 0} icon={FaCheck} color="green" bgColor="bg-green-100" />
            </div>

            {/* Performance Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                    <FaChartLine className="text-primary text-xl" />
                    <h3 className="text-xl font-bold text-gray-800">Weekly Performance</h3>
                </div>
                
                {chartData.length > 0 ? (
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} allowDecimals={false} />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="Resolved" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed">
                        <p className="text-gray-400">No resolution data available for this week yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffHome;