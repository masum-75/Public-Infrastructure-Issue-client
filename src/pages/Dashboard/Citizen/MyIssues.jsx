import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaEdit, FaTrash, FaEye, FaBolt, FaInbox } from 'react-icons/fa';
import { Link } from 'react-router';
import EditIssueModal from './EditIssueModal';

const CATEGORIES = ['Pothole', 'Streetlight', 'Water Leakage', 'Garbage Overflow', 'Damaged Footpath'];
const STATUSES = ['Pending', 'In-Progress', 'Resolved', 'Rejected'];

const STATUS_CONFIG = {
    'Resolved':    { text: 'text-emerald-300', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', dot: 'bg-emerald-400' },
    'In-Progress': { text: 'text-amber-300',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20',   dot: 'bg-amber-400' },
    'Rejected':    { text: 'text-red-300',     bg: 'bg-red-400/10',     border: 'border-red-400/20',     dot: 'bg-red-400' },
    'Pending':     { text: 'text-sky-300',     bg: 'bg-sky-400/10',     border: 'border-sky-400/20',     dot: 'bg-sky-400' },
};

const ConfirmDialog = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-slate-900 border border-slate-700/60 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <FaTrash className="text-red-400 text-2xl" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Delete This Issue?</h3>
                <p className="text-slate-400 text-sm mb-7">Only Pending issues can be deleted. This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all">Delete</button>
                </div>
            </div>
        </div>
    );
};

const MyIssues = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState({ status: '', category: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    };

    const { data: myIssues = [], isLoading, refetch } = useQuery({
        queryKey: ['myIssues', user?.email, filters],
        enabled: !!user?.email,
        queryFn: async () => {
            const params = new URLSearchParams(filters);
            const res = await axiosSecure.get(`/dashboard/my-issues?${params.toString()}`);
            return res.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/dashboard/my-issues/${id}`),
        onSuccess: (res) => {
            if (res.data.deletedCount > 0) {
                showToast('Issue deleted successfully.');
                queryClient.invalidateQueries({ queryKey: ['myIssues'] });
            }
        },
        onError: () => showToast('Only Pending issues can be deleted.', 'error'),
    });

    const selectClass = "h-10 bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 rounded-xl px-3 text-xs font-semibold text-slate-300 focus:outline-none transition-all appearance-none cursor-pointer";

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center h-80 gap-4">
            <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading your issues...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-[9998] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl text-sm font-bold ${toast.type === 'error'
                    ? 'bg-red-900/95 border-red-700/60 text-red-200'
                    : 'bg-emerald-900/95 border-emerald-700/60 text-emerald-200'
                    }`}>
                    {toast.type === 'error' ? '✕' : '✓'} {toast.message}
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onConfirm={() => { deleteMutation.mutate(deleteTarget); setDeleteTarget(null); }}
                onCancel={() => setDeleteTarget(null)}
            />

            {/* Header + Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    My Reported Issues
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs font-black rounded-lg">
                        {myIssues.length}
                    </span>
                </h2>
                <div className="flex items-center gap-2">
                    <select value={filters.category} onChange={(e) => setFilters(p => ({ ...p, category: e.target.value }))}
                        className={selectClass} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', paddingRight: '28px' }}>
                        <option value="">All Categories</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select value={filters.status} onChange={(e) => setFilters(p => ({ ...p, status: e.target.value }))}
                        className={selectClass} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', paddingRight: '28px' }}>
                        <option value="">All Status</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            {myIssues.length > 0 ? (
                <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden">
                    {/* Desktop */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800/60">
                                    {['#', 'Issue', 'Location', 'Status', 'Priority', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40">
                                {myIssues.map((issue, index) => {
                                    const sc = STATUS_CONFIG[issue.status] || STATUS_CONFIG['Pending'];
                                    return (
                                        <tr key={issue._id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-5 py-4 text-slate-600 text-sm font-bold tabular-nums">{index + 1}</td>
                                            <td className="px-5 py-4">
                                                <p className="font-bold text-white text-sm line-clamp-1 group-hover:text-blue-300 transition-colors">{issue.title}</p>
                                                <span className="inline-block text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md mt-1">{issue.category}</span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-500 text-sm italic truncate max-w-[140px]">{issue.location}</td>
                                            <td className="px-5 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${sc.bg} border ${sc.border} rounded-full`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                                    <span className={`text-[10px] font-bold ${sc.text}`}>{issue.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${issue.priority === 'High'
                                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                    : 'bg-slate-800 text-slate-500'
                                                    }`}>
                                                    {issue.priority === 'High' && <FaBolt className="text-[9px]" />}
                                                    {issue.priority}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link to={`/issue/${issue._id}`}
                                                        className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all">
                                                        <FaEye className="text-xs" />
                                                    </Link>
                                                    {issue.status === 'Pending' && (
                                                        <>
                                                            <button onClick={() => { setSelectedIssue(issue); setIsModalOpen(true); }}
                                                                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all">
                                                                <FaEdit className="text-xs" />
                                                            </button>
                                                            <button onClick={() => setDeleteTarget(issue._id)} disabled={deleteMutation.isPending}
                                                                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all disabled:opacity-40">
                                                                <FaTrash className="text-xs" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-slate-800/40">
                        {myIssues.map((issue) => {
                            const sc = STATUS_CONFIG[issue.status] || STATUS_CONFIG['Pending'];
                            return (
                                <div key={issue._id} className="p-5 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-bold text-white text-sm line-clamp-1">{issue.title}</p>
                                            <span className="inline-block text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md mt-1">{issue.category}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 ${sc.bg} border ${sc.border} rounded-full shrink-0`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                            <span className={`text-[10px] font-bold ${sc.text}`}>{issue.status}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-xs italic">{issue.location}</p>
                                    <div className="flex items-center gap-2 pt-1">
                                        <Link to={`/issue/${issue._id}`} className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all">
                                            <FaEye className="text-xs" />
                                        </Link>
                                        {issue.status === 'Pending' && (
                                            <>
                                                <button onClick={() => { setSelectedIssue(issue); setIsModalOpen(true); }} className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-amber-400 transition-all">
                                                    <FaEdit className="text-xs" />
                                                </button>
                                                <button onClick={() => setDeleteTarget(issue._id)} className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all">
                                                    <FaTrash className="text-xs" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-slate-900/40 border border-dashed border-slate-700/60 rounded-3xl">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-5">
                        <FaInbox className="text-slate-600 text-3xl" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No issues found</h3>
                    <p className="text-slate-500 text-sm text-center max-w-xs">
                        {filters.category || filters.status ? 'No results match your current filters.' : "You haven't reported any issues yet."}
                    </p>
                </div>
            )}

            {isModalOpen && selectedIssue && (
                <EditIssueModal
                    issue={selectedIssue}
                    onClose={() => { setIsModalOpen(false); setSelectedIssue(null); }}
                    refetch={refetch}
                />
            )}
        </div>
    );
};

export default MyIssues;