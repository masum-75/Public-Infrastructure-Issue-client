import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaUserTie, FaBan, FaFilter, FaListAlt } from 'react-icons/fa';
import AssignStaffModal from './AssignStaffModal'; 

const statuses = ['Pending', 'In-Progress', 'Resolved', 'Rejected'];

const AllIssuesAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIssueId, setSelectedIssueId] = useState(null);
    const [filters, setFilters] = useState({ status: '', priority: '' });
    
    const { data: issueData = {}, isLoading, refetch } = useQuery({
        queryKey: ['allIssuesAdmin', filters],
        queryFn: async () => {
             const params = new URLSearchParams(filters);
             const res = await axiosSecure.get(`/issues/all?${params.toString()}&limit=1000`);
             return res.data;
        }
    });

    const issues = issueData.issues || [];
    
    const { data: staffList = [] } = useQuery({
        queryKey: ['staffList'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users/staff'); 
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });
    
    const rejectMutation = useMutation({
        mutationFn: (issueId) => axiosSecure.patch(`/dashboard/admin/issues/${issueId}/reject`),
        onSuccess: () => {
            Swal.fire('Rejected!', 'Issue status updated to Rejected.', 'success');
            refetch();
        },
        onError: () => Swal.fire('Error', 'Only Pending issues can be rejected.', 'error')
    });

    const handleReject = (issue) => {
        if (issue.status !== 'Pending') {
             Swal.fire('Warning', 'Can only reject Pending issues.', 'warning');
             return;
        }
        Swal.fire({
            title: 'Confirm Rejection?',
            text: `Rejecting: ${issue.title}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Reject'
        }).then((result) => {
            if (result.isConfirmed) rejectMutation.mutate(issue._id);
        });
    };
    
    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (isLoading) return <div className="flex justify-center mt-20"><span className="loading loading-infinity loading-lg text-primary"></span></div>;

    return (
        <div className='p-6 bg-white min-h-screen'>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b pb-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                        <FaListAlt className="text-primary" /> All Reported Issues
                    </h2>
                    <p className="text-gray-500 font-bold mt-1">Total Issues Found: {issues.length}</p>
                </div>

                {/* Filters Section - Fixed Overlapping */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-gray-100 px-4 rounded-xl border border-gray-200">
                        <FaFilter className="text-gray-400 text-sm" />
                        <select 
                            name="status" 
                            value={filters.status} 
                            onChange={handleFilterChange} 
                            className="select select-ghost focus:bg-transparent font-bold text-gray-700 h-10 min-h-0"
                        >
                            <option value="">All Status</option>
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 px-4 rounded-xl border border-gray-200">
                        <FaFilter className="text-gray-400 text-sm" />
                        <select 
                            name="priority" 
                            value={filters.priority} 
                            onChange={handleFilterChange} 
                            className="select select-ghost focus:bg-transparent font-bold text-gray-700 h-10 min-h-0"
                        >
                            <option value="">All Priority</option>
                            <option value="High">High</option>
                            <option value="Normal">Normal</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Section - High Contrast Design */}
            <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm">
                <table className="table w-full">
                    <thead className="bg-gray-50 text-gray-800 font-black uppercase text-xs tracking-wider">
                        <tr>
                            <th className="py-5 pl-6">#</th>
                            <th>Issue Info</th>
                            <th>Current Status</th>
                            <th>Priority</th>
                            <th>Assigned Staff</th>
                            <th className="text-center">Manage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {issues.map((issue, index) => (
                            <tr key={issue._id} className="hover:bg-gray-50 transition-colors">
                                <th className="pl-6 font-bold text-gray-400">{index + 1}</th>
                                <td>
                                    <div className="font-black text-gray-800 text-base">{issue.title}</div>
                                    <span className="badge badge-sm badge-outline font-bold text-gray-400 mt-1 uppercase">{issue.category}</span>
                                </td>
                                <td>
                                    <span className={`badge font-bold h-7 px-4 border-none text-white ${
                                        issue.status === 'Resolved' ? 'bg-green-500' : 
                                        issue.status === 'Pending' ? 'bg-blue-500' : 
                                        issue.status === 'Rejected' ? 'bg-red-500' : 'bg-orange-500'
                                    }`}>
                                        {issue.status}
                                    </span>
                                </td>
                                <td>
                                    <span className={`font-black ${issue.priority === 'High' ? 'text-red-600 underline' : 'text-gray-600'}`}>
                                        {issue.priority}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                        <span className={`font-bold ${issue.assignedStaffName ? 'text-gray-800' : 'text-gray-300 italic'}`}>
                                            {issue.assignedStaffName || 'Unassigned'}
                                        </span>
                                    </div>
                                </td>
                                <td className="flex justify-center gap-2">
                                    <button 
                                        onClick={() => { setSelectedIssueId(issue._id); setIsModalOpen(true); }}
                                        className="btn btn-sm btn-primary text-white font-bold gap-2 px-4 shadow-md"
                                        disabled={!!issue.assignedStaffEmail || issue.status === 'Rejected'}
                                    >
                                        <FaUserTie /> Assign
                                    </button>
                                    <button
                                        onClick={() => handleReject(issue)}
                                        className="btn btn-sm btn-outline btn-error hover:text-white font-bold"
                                        disabled={issue.status !== 'Pending'}
                                    >
                                        <FaBan />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Logic */}
            {isModalOpen && (
                <AssignStaffModal 
                    issueId={selectedIssueId} 
                    staffList={staffList} 
                    onClose={() => setIsModalOpen(false)} 
                    refetchIssues={refetch}
                />
            )}
        </div>
    );
};

export default AllIssuesAdmin;