import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaEdit, FaEye, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router';

const statusOptions = [
    { value: 'In-Progress', label: 'Start Work (In-Progress)' },
    { value: 'Working', label: 'Progress Update (Working)' },
    { value: 'Resolved', label: 'Mark as Resolved' },
    { value: 'Closed', label: 'Close Issue' }
];

const AssignedIssues = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [filters] = useState({ status: '', priority: '' });

    // Fetch issues assigned to the logged-in staff
    const { data: assignedIssues = [], isLoading, refetch } = useQuery({
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
            Swal.fire('Success!', 'Issue status updated successfully.', 'success');
            queryClient.invalidateQueries({ queryKey: ['assignedIssues'] });
        },
        onError: () => {
            Swal.fire('Error', 'Failed to update status.', 'error');
        }
    });

    const handleStatusChange = (e, issueId) => {
        const newStatus = e.target.value;
        if (!newStatus) return;

        Swal.fire({
            title: 'Confirm Status Change?',
            text: `Change status to: ${newStatus}?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Update!'
        }).then((result) => {
            if (result.isConfirmed) {
                statusMutation.mutate({ issueId, newStatus });
            }
        });
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'badge-success';
            case 'In-Progress':
            case 'Working': return 'badge-warning';
            case 'Closed': return 'badge-neutral';
            case 'Pending':
            default: return 'badge-info';
        }
    };

    if (isLoading) {
        return <span className="loading loading-infinity loading-xl block mx-auto mt-20"></span>;
    }

    return (
        <div className='p-4'>
            <h2 className="text-4xl font-bold mb-6 text-primary">My Assigned Issues ({assignedIssues.length})</h2>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Issue Title</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Update Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedIssues.map((issue, index) => (
                            <tr key={issue._id}>
                                <th>{index + 1}</th>
                                <td>
                                    <span className="font-bold">{issue.title}</span>
                                    <br /><span className="badge badge-sm badge-outline">{issue.category}</span>
                                </td>
                                <td>{issue.location}</td>
                                <td><span className={`badge badge-lg ${getStatusColor(issue.status)} text-white`}>{issue.status}</span></td>
                                <td><span className={`font-bold ${issue.priority === 'High' ? 'text-red-500' : 'text-gray-500'}`}>{issue.priority}</span></td>
                                <td>
                                    <select 
                                        onChange={(e) => handleStatusChange(e, issue._id)}
                                        value={issue.status} // Current status
                                        className="select select-bordered select-sm w-full max-w-xs"
                                        disabled={statusMutation.isPending}
                                    >
                                        <option value={issue.status} disabled>Change Status</option>
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value} disabled={issue.status === option.value || (issue.status === 'Resolved' && option.value !== 'Closed') || issue.status === 'Closed'}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <Link to={`/issue/${issue._id}`} className="btn btn-sm btn-info tooltip" data-tip="View Details"><FaEye /></Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignedIssues;