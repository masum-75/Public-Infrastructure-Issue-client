import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaEye, FaMapMarkerAlt, FaCircle, FaInbox } from 'react-icons/fa';
import { Link } from 'react-router';

const statusOptions = [
    { value: 'In-Progress', label: 'Start Work' },
    { value: 'Working', label: 'Progress Update' },
    { value: 'Resolved', label: 'Mark Resolved' },
    { value: 'Closed', label: 'Close Issue' }
];

const AssignedIssues = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [filters] = useState({ status: '', priority: '' });

    const { data: assignedIssues = [], isLoading } = useQuery({
        queryKey: ['assignedIssues', user?.email, filters],
        enabled: !!user?.email,
        queryFn: async () => {
            const params = new URLSearchParams(filters);
            const res = await axiosSecure.get(`/dashboard/staff/assigned-issues?email=${user.email}&${params.toString()}`); 
            return res.data;
        }
    });

    const statusMutation = useMutation({
        mutationFn: ({ issueId, newStatus }) => {
            return axiosSecure.patch(`/dashboard/staff/issues/${issueId}/status`, { newStatus }); 
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'The issue status has been updated.',
                timer: 1500,
                showConfirmButton: false
            });
            queryClient.invalidateQueries({ queryKey: ['assignedIssues'] });
        },
        onError: () => Swal.fire('Error', 'Update failed. Check connection.', 'error')
    });

    const handleStatusChange = (e, issueId) => {
        const newStatus = e.target.value;
        if (!newStatus) return;

        Swal.fire({
            title: 'Confirm Update?',
            text: `Update status to: ${newStatus}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            confirmButtonText: 'Yes, Update'
        }).then((result) => {
            if (result.isConfirmed) statusMutation.mutate({ issueId, newStatus });
        });
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'In-Progress':
            case 'Working': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center h-96">
            <span className="loading loading-spinner loading-lg text-indigo-600"></span>
            <p className="mt-4 text-gray-500 font-medium tracking-wide">Fetching assigned tasks...</p>
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                    Assigned Issues 
                    <span className="badge badge-lg bg-indigo-600 border-none text-white px-4">{assignedIssues.length}</span>
                </h2>
                <p className="text-gray-500 mt-2">Manage and update the status of citizen reports assigned to you.</p>
            </header>

            {assignedIssues.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="table w-full border-collapse">
                        <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="p-5">Issue Details</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Actions</th>
                                <th className="text-center">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {assignedIssues.map((issue) => (
                                <tr key={issue._id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">{issue.title}</span>
                                            <span className="text-xs text-indigo-500 font-semibold bg-indigo-50 w-fit px-2 py-0.5 rounded mt-1">{issue.category}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <FaMapMarkerAlt className="text-gray-400" />
                                            {issue.location}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(issue.status)}`}>
                                            <FaCircle className="inline-block text-[8px] mr-1.5 mb-0.5" />
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-md text-xs font-black ${issue.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'}`}>
                                            {issue.priority}
                                        </span>
                                    </td>
                                    <td>
                                        <select 
                                            onChange={(e) => handleStatusChange(e, issue._id)}
                                            value={issue.status}
                                            className="select select-bordered select-sm w-full max-w-[160px] text-xs font-medium focus:ring-2 focus:ring-indigo-500 rounded-lg"
                                            disabled={statusMutation.isPending || issue.status === 'Closed'}
                                        >
                                            <option value={issue.status} disabled>Update Status</option>
                                            {statusOptions.map(opt => (
                                                <option key={opt.value} value={opt.value} disabled={issue.status === opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <Link 
                                            to={`/issue/${issue._id}`} 
                                            className="btn btn-ghost btn-sm text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all"
                                        >
                                            <FaEye className="text-lg" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <FaInbox className="text-6xl text-gray-200 mb-4" />
                    <h3 className="text-xl font-bold text-gray-400">All clear! No issues assigned.</h3>
                    <p className="text-gray-400">New reports will appear here as they are assigned to you.</p>
                </div>
            )}
        </div>
    );
};

export default AssignedIssues;