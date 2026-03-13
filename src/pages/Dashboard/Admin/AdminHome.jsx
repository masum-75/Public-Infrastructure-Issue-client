import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {
    FaTicketAlt, FaCheckCircle, FaHourglassHalf,
    FaTimesCircle, FaChartBar, FaHistory, FaBolt
} from 'react-icons/fa';
import { MdAttachMoney } from 'react-icons/md';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const STAT_CARDS = (stats) => [
    { title: 'Total Issues',   value: stats.totalIssues    || 0,     icon: FaTicketAlt,    color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/15' },
    { title: 'Resolved',       value: stats.resolvedIssues || 0,     icon: FaCheckCircle,  color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15' },
    { title: 'Pending',        value: stats.pendingIssues  || 0,     icon: FaHourglassHalf,color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/15' },
    { title: 'Rejected',       value: stats.rejectedIssues || 0,     icon: FaTimesCircle,  color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/15' },
    { title: 'Total Revenue',  value: `৳${(stats.totalRevenue || 0).toLocaleString()}`, icon: MdAttachMoney, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/15' },
];

const STATUS_CONFIG = {
    'Resolved':    { text: 'text-emerald-300', dot: 'bg-emerald-400' },
    'In-Progress': { text: 'text-amber-300',   dot: 'bg-amber-400' },
    'Rejected':    { text: 'text-red-300',     dot: 'bg-red-400' },
    'Pending':     { text: 'text-sky-300',     dot: 'bg-sky-400' },
};

const BAR_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) return (
        <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 shadow-xl">
            <p className="text-slate-400 text-xs font-bold mb-1">{label}</p>
            <p className="text-blue-400 font-black text-lg">{payload[0].value} <span className="text-xs font-bold text-slate-500">issues</span></p>
        </div>
    );
    return null;
};

const AdminHome = () => {
    const axiosSecure = useAxiosSecure();

    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => (await axiosSecure.get('/dashboard/admin/stats')).data,
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center h-80 gap-4">
            <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading admin insights...</p>
        </div>
    );

    const chartData = stats.categoryStats?.map(item => ({ name: item._id, Issues: item.count })) || [];

    return (
        <div className="space-y-8">

            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">System Analytics</h2>
                    <p className="text-slate-500 text-sm mt-1">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800/60 rounded-xl self-start sm:self-auto">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-slate-400">Live Status: Active</span>
                </div>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {STAT_CARDS(stats).map(({ title, value, icon: Icon, color, bg, border }) => (
                    <div key={title} className={`p-5 bg-slate-900 border ${border} rounded-2xl group hover:border-opacity-60 transition-all duration-300`}>
                        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <Icon className={`text-base ${color}`} />
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</p>
                        <p className={`text-3xl font-black ${color} tabular-nums`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800/60 rounded-2xl p-7">
                    <div className="flex items-center gap-3 mb-7">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <FaChartBar className="text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-white">Issues by Category</h3>
                            <p className="text-slate-500 text-xs">Distribution across all issue types</p>
                        </div>
                    </div>
                    {chartData.length > 0 ? (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} dy={8} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                    <Bar dataKey="Issues" radius={[6, 6, 0, 0]} barSize={38}>
                                        {chartData.map((_, idx) => (
                                            <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} fillOpacity={0.85} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center bg-slate-800/30 border border-dashed border-slate-700/60 rounded-xl">
                            <p className="text-slate-500 text-sm">No category data available.</p>
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-7">
                    <div className="flex items-center gap-3 mb-7 pb-5 border-b border-slate-800/60">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                            <FaHistory className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-white">Recent Activity</h3>
                            <p className="text-slate-500 text-xs">Latest submitted issues</p>
                        </div>
                    </div>
                    <ul className="space-y-5">
                        {stats.latestIssues?.length > 0 ? stats.latestIssues.map(issue => {
                            const sc = STATUS_CONFIG[issue.status] || STATUS_CONFIG['Pending'];
                            return (
                                <li key={issue._id} className="flex items-start gap-3 group">
                                    <div className={`w-1.5 h-1.5 rounded-full ${sc.dot} mt-2 shrink-0`} />
                                    <div className="min-w-0">
                                        <p className="font-bold text-white text-sm truncate group-hover:text-blue-300 transition-colors">{issue.title}</p>
                                        <p className="text-xs text-slate-600 mt-0.5 truncate">
                                            {issue.location} · <span className={`font-bold ${sc.text}`}>{issue.status}</span>
                                        </p>
                                    </div>
                                </li>
                            );
                        }) : (
                            <p className="text-slate-600 text-sm text-center py-8">No recent activity.</p>
                        )}
                    </ul>
                </div>
            </div>

            {/* Recent Payments Table */}
            <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-7">
                <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
                            <MdAttachMoney className="text-violet-400 text-xl" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-white">Recent Transactions</h3>
                            <p className="text-slate-500 text-xs">Latest payment records</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800/60">
                                {['#', 'Subscriber', 'Type', 'Amount', 'Date'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                            {stats.latestPayments?.length > 0 ? stats.latestPayments.map((payment, index) => (
                                <tr key={payment._id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-4 py-4 text-slate-600 text-sm tabular-nums">{index + 1}</td>
                                    <td className="px-4 py-4">
                                        <p className="font-bold text-white text-sm">{payment.customerEmail?.split('@')[0]}</p>
                                        <p className="text-slate-600 text-xs">{payment.customerEmail}</p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${payment.type === 'boost'
                                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            }`}>
                                            {payment.type === 'boost' && <FaBolt className="text-[9px]" />}
                                            {payment.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="font-black text-white">৳{payment.amount}</span>
                                    </td>
                                    <td className="px-4 py-4 text-slate-500 text-sm">
                                        {new Date(payment.paidAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-slate-600 text-sm">No recent transactions.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;