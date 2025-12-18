import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaTicketAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaDollarSign, FaChartBar, FaHistory } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const StatCard = ({ title, value, icon: Icon, colorClass, borderClass }) => (
    <div className={`card shadow-xl bg-white border-l-8 ${borderClass} hover:scale-105 transition-transform duration-300`}>
        <div className="card-body p-6 flex-row items-center justify-between">
            <div>
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs mb-1">{title}</p>
                <h3 className="text-3xl font-black text-gray-800 tracking-tight">{value}</h3>
            </div>
            <div className={`p-4 rounded-2xl bg-gray-50 ${colorClass}`}>
                <Icon className="text-3xl opacity-90" />
            </div>
        </div>
    </div>
);

const AdminHome = () => {
    const axiosSecure = useAxiosSecure();

    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/dashboard/admin/stats');
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
                <span className="loading loading-infinity loading-lg text-primary"></span>
                <p className="font-bold text-gray-400 animate-pulse uppercase text-xs">Loading Admin Insights...</p>
            </div>
        );
    }

    const chartData = stats.categoryStats?.map(item => ({
        name: item._id,
        Issues: item.count,
    })) || [];
    
    return (
        <div className='p-6 lg:p-10 space-y-10 bg-gray-50 min-h-screen'>
          
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">System Analytics</h2>
                    <p className="text-gray-500 font-bold mt-1">Welcome back, Admin. Here is what's happening today.</p>
                </div>
                <div className="text-right hidden md:block">
                    <span className="badge badge-lg badge-primary font-black px-6 py-4 shadow-lg shadow-indigo-100 uppercase tracking-tighter">Live Status: Active</span>
                </div>
            </div>

           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <StatCard title="Total Issues" value={stats.totalIssues || 0} icon={FaTicketAlt} colorClass="text-blue-600" borderClass="border-blue-500" />
                <StatCard title="Resolved" value={stats.resolvedIssues || 0} icon={FaCheckCircle} colorClass="text-green-600" borderClass="border-green-500" />
                <StatCard title="Pending" value={stats.pendingIssues || 0} icon={FaHourglassHalf} colorClass="text-cyan-600" borderClass="border-cyan-400" />
                <StatCard title="Rejected" value={stats.rejectedIssues || 0} icon={FaTimesCircle} colorClass="text-red-600" borderClass="border-red-500" />
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue?.toFixed(2) || '0.00'}`} icon={FaDollarSign} colorClass="text-amber-600" borderClass="border-amber-400" />
            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                        <FaChartBar className="text-indigo-600 text-xl" />
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Issues Distribution by Category</h3>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }} 
                                />
                                <Bar dataKey="Issues" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
               
                <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-8 border-b pb-4">
                        <FaHistory className="text-blue-600 text-xl" />
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Recent Activity</h3>
                    </div>
                    <ul className="space-y-6">
                        {stats.latestIssues?.map(issue => (
                            <li key={issue._id} className="group cursor-default">
                                <div className="flex items-start gap-4">
                                    <div className={`w-1 h-12 rounded-full ${issue.status === 'Resolved' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                    <div>
                                        <p className='font-black text-gray-800 text-sm group-hover:text-primary transition-colors'>{issue.title}</p>
                                        <p className='text-xs text-gray-400 font-bold mt-1'>{issue.location} • <span className="uppercase text-blue-500">{issue.status}</span></p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

           
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
                        <FaDollarSign className="text-green-600" /> Recent Financial Transactions
                    </h3>
                    <button className="btn btn-ghost btn-sm font-black text-primary uppercase text-xs">View All History</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-50">
                            <tr className="text-gray-500 font-black uppercase text-xs tracking-widest border-none">
                                <th className="rounded-l-xl py-4">#</th>
                                <th>Subscriber Email</th>
                                <th>Transaction Type</th>
                                <th>Amount (USD)</th>
                                <th className="rounded-r-xl">Payment Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats.latestPayments?.map((payment, index) => (
                                <tr key={payment._id} className="hover:bg-gray-50 transition-colors border-none">
                                    <th className="py-5 font-bold text-gray-400">{index + 1}</th>
                                    <td className="font-black text-gray-700">{payment.customerEmail}</td>
                                    <td>
                                        <span className={`badge font-black text-[10px] uppercase px-3 py-3 border-none ${payment.type === 'boost' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-700'}`}>
                                            {payment.type}
                                        </span>
                                    </td>
                                    <td className="font-black text-gray-900">${payment.amount}</td>
                                    <td className="font-bold text-gray-500">{new Date(payment.paidAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;