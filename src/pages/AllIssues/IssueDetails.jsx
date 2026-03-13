import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import {
    FaMapMarkerAlt, FaCalendarAlt, FaStar, FaRegStar,
    FaRegEdit, FaTrash, FaLevelUpAlt, FaSpinner,
    FaHeart, FaRegHeart, FaHistory, FaUserShield,
    FaCheckCircle, FaTimesCircle, FaExclamationTriangle,
    FaChevronLeft, FaBolt
} from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ── Inline Confirm Dialog ────────────────────────────────────────────────────
const ConfirmDialog = ({ isOpen, title, message, confirmText, confirmClass, onConfirm, onCancel, icon: Icon, iconClass }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-slate-900 border border-slate-700/60 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                {Icon && (
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${iconClass}`}>
                        <Icon className="text-2xl" />
                    </div>
                )}
                <h3 className="text-xl font-black text-white text-center mb-2">{title}</h3>
                <p className="text-slate-400 text-sm text-center mb-8 leading-relaxed">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-xl transition-all text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-3 font-bold rounded-xl transition-all text-sm text-white ${confirmClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type }) => (
    <div className={`fixed bottom-6 right-6 z-[9998] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl text-sm font-bold ${type === 'error'
        ? 'bg-red-900/90 border-red-700/60 text-red-200'
        : type === 'info'
            ? 'bg-blue-900/90 border-blue-700/60 text-blue-200'
            : 'bg-emerald-900/90 border-emerald-700/60 text-emerald-200'
        }`}>
        {type === 'error' ? <FaTimesCircle /> : <FaCheckCircle />}
        {message}
    </div>
);

// ── Status styling ───────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    'Resolved':    { text: 'text-emerald-300', bg: 'bg-emerald-400/10', border: 'border-emerald-400/25', dot: 'bg-emerald-400' },
    'In-Progress': { text: 'text-amber-300',   bg: 'bg-amber-400/10',   border: 'border-amber-400/25',   dot: 'bg-amber-400' },
    'Rejected':    { text: 'text-red-300',     bg: 'bg-red-400/10',     border: 'border-red-400/25',     dot: 'bg-red-400' },
    'Pending':     { text: 'text-sky-300',     bg: 'bg-sky-400/10',     border: 'border-sky-400/25',     dot: 'bg-sky-400' },
};

const IssueDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { role, isBlocked } = useRole();
    const queryClient = useQueryClient();

    const [dialog, setDialog] = useState(null); // { type: 'delete' | 'boost' }
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    };

    // Data
    const { data: issue = {}, isLoading: issueLoading } = useQuery({
        queryKey: ['issues', id],
        queryFn: async () => (await axiosSecure.get(`/issues/${id}`)).data,
        enabled: !!id,
    });

    const { data: timeline = [], isLoading: timelineLoading } = useQuery({
        queryKey: ['timeline', id],
        queryFn: async () => (await axiosSecure.get(`/trackings/${id}/logs`)).data,
        enabled: !!id,
    });

    const isOwner = user?.email === issue.citizenEmail;
    const statusConfig = STATUS_CONFIG[issue.status] || STATUS_CONFIG['Pending'];

    // Mutations
    const boostMutation = useMutation({
        mutationFn: (boostData) => axiosSecure.post('/boost-checkout-session', boostData),
        onSuccess: (res) => { window.location.href = res.data.url; },
        onError: () => showToast('Failed to initiate boost payment.', 'error'),
    });

    const deleteMutation = useMutation({
        mutationFn: (issueId) => axiosSecure.delete(`/dashboard/my-issues/${issueId}`),
        onSuccess: (res) => {
            if (res.data.deletedCount > 0) {
                showToast('Issue removed successfully.');
                setTimeout(() => navigate('/dashboard/my-issues'), 1000);
            }
        },
        onError: () => showToast('Failed to delete issue.', 'error'),
    });

    // Loading state
    if (issueLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] gap-4 bg-slate-950">
                <div className="w-12 h-12 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
                <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Loading Details</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950">
            {toast && <Toast message={toast.message} type={toast.type} />}

            {/* Confirm Dialogs */}
            <ConfirmDialog
                isOpen={dialog?.type === 'delete'}
                title="Delete This Issue?"
                message="Only 'Pending' issues can be permanently removed. This action cannot be undone."
                confirmText="Delete Issue"
                confirmClass="bg-red-600 hover:bg-red-500"
                icon={FaTrash}
                iconClass="bg-red-500/10 text-red-400"
                onConfirm={() => { setDialog(null); deleteMutation.mutate(id); }}
                onCancel={() => setDialog(null)}
            />
            <ConfirmDialog
                isOpen={dialog?.type === 'boost'}
                title="Upgrade to High Priority?"
                message="Boost this issue to 'High Priority' for 100 Taka. This will trigger an immediate payment process."
                confirmText="Proceed to Payment"
                confirmClass="bg-blue-600 hover:bg-blue-500"
                icon={FaLevelUpAlt}
                iconClass="bg-blue-500/10 text-blue-400"
                onConfirm={() => { setDialog(null); boostMutation.mutate({ issueId: id, title: issue.title, cost: 100 }); }}
                onCancel={() => setDialog(null)}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-white transition-colors">
                        <FaChevronLeft className="text-xs" /> Back
                    </button>
                    <span className="text-slate-700">/</span>
                    <span className="text-sm font-medium text-slate-500">{issue.category}</span>
                    <span className="text-slate-700">/</span>
                    <span className="text-sm font-medium text-slate-400 truncate max-w-[200px]">{issue.title}</span>
                </div>

                {/* Page title */}
                <h1 className="text-3xl md:text-4xl font-black text-white mb-10 leading-tight">{issue.title}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ── Left Column ───────────────────────────────────────────── */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Main Card */}
                        <div className="bg-slate-900 border border-slate-800/60 rounded-3xl overflow-hidden">
                            <div className="relative h-[420px]">
                                <img
                                    src={issue.imageUrl}
                                    alt={issue.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                                {/* Status overlay */}
                                <div className={`absolute top-5 right-5 flex items-center gap-2 px-3 py-1.5 ${statusConfig.bg} backdrop-blur-sm border ${statusConfig.border} rounded-full`}>
                                    <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                                    <span className={`text-xs font-bold ${statusConfig.text}`}>{issue.status}</span>
                                </div>
                                {issue.priority === 'High' && (
                                    <div className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 backdrop-blur-sm border border-red-500/30 rounded-full">
                                        <FaBolt className="text-red-400 text-[10px]" />
                                        <span className="text-red-300 text-xs font-bold">High Priority</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-8">
                                {/* Priority row */}
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <div className={`flex items-center gap-2 font-black text-sm ${issue.priority === 'High' ? 'text-amber-400' : 'text-slate-600'}`}>
                                        {issue.priority === 'High' ? <FaStar /> : <FaRegStar />}
                                        <span className="uppercase tracking-wider">Priority: {issue.priority}</span>
                                    </div>
                                </div>

                                <p className="text-slate-400 text-base leading-relaxed mb-8">{issue.description}</p>

                                {/* Meta grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-slate-800/50 border border-slate-700/40 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center">
                                            <FaMapMarkerAlt className="text-blue-400 text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Location</p>
                                            <p className="font-bold text-slate-200 text-sm">{issue.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center">
                                            <FaCalendarAlt className="text-blue-400 text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Reported On</p>
                                            <p className="font-bold text-slate-200 text-sm">
                                                {new Date(issue.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Assigned staff */}
                                {issue.assignedStaffEmail && (
                                    <div className="mt-6 p-5 bg-blue-500/5 border border-blue-500/15 rounded-2xl flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-500/15 rounded-xl flex items-center justify-center shrink-0">
                                            <FaUserShield className="text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Assigned Official</p>
                                            <p className="font-bold text-slate-200">{issue.assignedStaffName || 'Support Team'}</p>
                                            <p className="text-sm text-slate-500">{issue.assignedStaffEmail}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-slate-900 border border-slate-800/60 rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                                    <FaHistory className="text-indigo-400" />
                                </div>
                                <h2 className="text-xl font-black text-white">Tracking Progress</h2>
                            </div>

                            {timelineLoading ? (
                                <div className="py-10 flex justify-center">
                                    <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
                                </div>
                            ) : timeline.length === 0 ? (
                                <p className="text-slate-500 text-sm text-center py-8">No tracking logs yet.</p>
                            ) : (
                                <div className="space-y-0">
                                    {timeline.map((log, idx) => (
                                        <div key={log._id} className="flex gap-4">
                                            {/* Connector */}
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-slate-900 shrink-0 mt-1" />
                                                {idx !== timeline.length - 1 && (
                                                    <div className="w-px flex-1 bg-slate-800 my-1" />
                                                )}
                                            </div>
                                            {/* Content */}
                                            <div className={`pb-8 ${idx === timeline.length - 1 ? '' : ''}`}>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </p>
                                                <p className="text-sm font-black text-white uppercase tracking-wide mb-1">{log.status}</p>
                                                <p className="text-slate-400 text-sm leading-relaxed">{log.message}</p>
                                                <p className="text-[11px] font-medium text-slate-600 mt-2">
                                                    Updated by: {log.staffName || log.updatedBy}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right Column ──────────────────────────────────────────── */}
                    <div className="lg:col-span-4 sticky top-8 space-y-5">

                        {/* Citizen Portal */}
                        <div className="bg-slate-900 border border-slate-800/60 rounded-3xl p-7">
                            <h3 className="text-lg font-black text-white mb-6">
                                Citizen <span className="text-blue-400">Portal</span>
                            </h3>

                            {/* Upvote status */}
                            <div className="mb-6 p-5 bg-slate-800/50 border border-slate-700/40 rounded-2xl text-center">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Upvote Status</p>
                                <div className={`flex items-center justify-center gap-2 text-lg font-black mb-1 ${issue.hasUpvoted ? 'text-red-400' : 'text-slate-600'}`}>
                                    {issue.hasUpvoted ? <FaHeart /> : <FaRegHeart />}
                                    <span>{issue.hasUpvoted ? 'Endorsed' : 'Not Upvoted'}</span>
                                </div>
                                <p className="text-xs font-bold text-slate-500">{issue.upvotes} citizens supported</p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                {isOwner && issue.status === 'Pending' && (
                                    <>
                                        <button
                                            onClick={() => navigate(`/dashboard/my-issues?edit=${id}`)}
                                            className="w-full h-12 flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 text-amber-300 font-bold rounded-xl transition-all text-sm"
                                        >
                                            <FaRegEdit /> Edit Report
                                        </button>
                                        <button
                                            onClick={() => setDialog({ type: 'delete' })}
                                            disabled={deleteMutation.isPending}
                                            className="w-full h-12 flex items-center justify-center gap-2 bg-red-500/5 border border-red-500/20 hover:bg-red-500/15 text-red-400 font-bold rounded-xl transition-all text-sm disabled:opacity-50"
                                        >
                                            {deleteMutation.isPending
                                                ? <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                                : <FaTrash />
                                            }
                                            Remove Issue
                                        </button>
                                    </>
                                )}

                                {isOwner && issue.priority !== 'High' && (
                                    <button
                                        onClick={() => {
                                            if (isBlocked) { showToast('Your account is restricted.', 'error'); return; }
                                            setDialog({ type: 'boost' });
                                        }}
                                        disabled={boostMutation.isPending || isBlocked}
                                        className="w-full h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {boostMutation.isPending
                                            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            : <FaLevelUpAlt />
                                        }
                                        Boost to High Priority
                                    </button>
                                )}

                                {!isOwner && (
                                    <p className="text-center text-xs font-bold text-slate-600 italic py-2">
                                        Viewing public record — limited actions available.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Back to all issues */}
                        <Link
                            to="/all-issues"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800/60 text-slate-400 hover:text-white font-bold text-sm rounded-2xl transition-all"
                        >
                            <FaChevronLeft className="text-xs" /> Back to All Issues
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetails;