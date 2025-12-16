import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaUserTie, FaBan, FaEye, FaSpinner } from 'react-icons/fa';
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
             const res = await axiosSecure.get(`/issues/all?${params.toString()}&limit=1000`); // Fetch all for admin view
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
        mutationFn: (issueId) => {
           
            return axiosSecure.patch(`/dashboard/admin/issues/${issueId}/reject`); 
        },
        onSuccess: () => {
            Swal.fire('Rejected!', 'Issue has been rejected and citizen notified.', 'error');
            refetch();
        },
        onError: () => {
            Swal.fire('Error', 'Failed to reject issue. Must be Pending status.', 'error');
        }
    });

    const handleReject = (issue) => {
        if (issue.status !== 'Pending') {
             Swal.fire('Cannot Reject', 'Only issues with "Pending" status can be rejected.', 'warning');
             return;
        }
        Swal.fire({
            title: 'Confirm Rejection?',
            text: `Are you sure you want to reject issue: ${issue.title}?`,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Reject It!'
        }).then((result) => {
            if (result.isConfirmed) {
                rejectMutation.mutate(issue._id);
            }
        });
    };
    
    const handleAssignStaff = (issueId) => {
        setSelectedIssueId(issueId);
        setIsModalOpen(true);
    };
    
    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (isLoading) {
        return <span className="loading loading-infinity loading-xl block mx-auto mt-20"></span>;
    }

    return (
        <div className='p-4'>
            <h2 className="text-4xl font-bold mb-6 text-primary">All Reported Issues (Admin View)</h2>
            
             <div className="mb-6 flex gap-4">
                <select name="status" value={filters.status} onChange={handleFilterChange} className="select select-bordered w-full max-w-xs">
                    <option value="">Filter by Status</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                 <select name="priority" value={filters.priority} onChange={handleFilterChange} className="select select-bordered w-full max-w-xs">
                    <option value="">Filter by Priority</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                </select>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title & Category</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Assigned Staff</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map((issue, index) => (
                            <tr key={issue._id}>
                                <th>{index + 1}</th>
                                <td>
                                    <span className="font-bold">{issue.title}</span>
                                    <br /><span className="badge badge-sm badge-outline">{issue.category}</span>
                                </td>
                                <td><span className={`badge badge-lg ${issue.status === 'Resolved' ? 'badge-success' : issue.status === 'Pending' ? 'badge-info' : 'badge-warning'} text-white`}>{issue.status}</span></td>
                                <td><span className={`font-bold ${issue.priority === 'High' ? 'text-red-500' : 'text-gray-500'}`}>{issue.priority}</span></td>
                                <td>
                                    {issue.assignedStaffName || <span className='text-gray-400'>Not Assigned</span>}
                                </td>
                                <td className="space-x-2">
                                    <button 
                                        onClick={() => handleAssignStaff(issue._id)}
                                        className="btn btn-sm btn-primary tooltip"
                                        data-tip="Assign Staff"
                                        disabled={!!issue.assignedStaffEmail || rejectMutation.isPending}
                                    >
                                        <FaUserTie /> Assign
                                    </button>
                                    <button
                                        onClick={() => handleReject(issue)}
                                        className="btn btn-sm btn-error text-white tooltip"
                                        data-tip="Reject Issue (Pending only)"
                                        disabled={issue.status !== 'Pending' || rejectMutation.isPending}
                                    >
                                        <FaBan />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Assign Staff Modal */}
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