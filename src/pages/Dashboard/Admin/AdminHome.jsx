import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaTicketAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaDollarSign } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color }) => (
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
        return <span className="loading loading-infinity loading-xl block mx-auto mt-20"></span>;
    }

    const chartData = stats.categoryStats?.map(item => ({
        name: item._id,
        Issues: item.count,
    })) || [];
    
    return (
        <div className='p-4 space-y-8'>
            <h2 className="text-4xl font-bold text-primary">Admin Dashboard Overview</h2>

          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard title="Total Issues" value={stats.totalIssues || 0} icon={FaTicketAlt} color="blue" />
                <StatCard title="Resolved" value={stats.resolvedIssues || 0} icon={FaCheckCircle} color="green" />
                <StatCard title="Pending" value={stats.pendingIssues || 0} icon={FaHourglassHalf} color="info" />
                <StatCard title="Rejected" value={stats.rejectedIssues || 0} icon={FaTimesCircle} color="red" />
                <StatCard title="Total Revenue (USD)" value={stats.totalRevenue?.toFixed(2) || '0.00'} icon={FaDollarSign} color="yellow" />
            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold mb-4">Issues by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Issues" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
             
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold mb-4 border-b pb-2">Latest Issues</h3>
                    <ul className="space-y-3">
                        {stats.latestIssues?.map(issue => (
                            <li key={issue._id} className="text-sm border-l-4 border-blue-500 pl-3">
                                <p className='font-semibold'>{issue.title}</p>
                                <p className='text-xs text-gray-500'>{issue.location} - {issue.status}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

           
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4 border-b pb-2">Latest Payments</h3>
                <div className="overflow-x-auto">
                     <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.latestPayments?.map((payment, index) => (
                                <tr key={payment._id}>
                                    <th>{index + 1}</th>
                                    <td>{payment.customerEmail}</td>
                                    <td><span className={`badge ${payment.type === 'boost' ? 'badge-info' : 'badge-warning'}`}>{payment.type}</span></td>
                                    <td>${payment.amount}</td>
                                    <td>{new Date(payment.paidAt).toLocaleDateString()}</td>
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