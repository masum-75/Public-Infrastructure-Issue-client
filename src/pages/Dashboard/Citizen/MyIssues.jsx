import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { Link } from 'react-router';
import EditIssueModal from './EditIssueModal'; 

const MyIssues = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState({ status: '', category: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);

   
    const { data: myIssues = [], isLoading, refetch } = useQuery({
        queryKey: ['myIssues', user?.email, filters],
        enabled: !!user?.email,
        queryFn: async () => {
            const params = new URLSearchParams(filters);
            const res = await axiosSecure.get(`/dashboard/my-issues?${params.toString()}`);
            return res.data;
        }
    });

   
    const deleteMutation = useMutation({
        mutationFn: (id) => {
            return axiosSecure.delete(`/dashboard/my-issues/${id}`);
        },
        onSuccess: (res) => {
            if (res.data.deletedCount > 0) {
                Swal.fire('Deleted!', 'Your issue has been deleted.', 'success');
                queryClient.invalidateQueries({ queryKey: ['myIssues'] });
            } else {
                Swal.fire('Error', 'Could not delete issue. Status must be Pending.', 'error');
            }
        },
        onError: () => {
             Swal.fire('Error', 'Failed to delete. Check issue status.', 'error');
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! Only Pending issues can be deleted.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };
    
    const handleEdit = (issue) => {
        setSelectedIssue(issue);
        setIsModalOpen(true);
    }
    
    
    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

  
    const categories = ['Pothole', 'Streetlight', 'Water Leakage', 'Garbage Overflow', 'Damaged Footpath'];
    const statuses = ['Pending', 'In-Progress', 'Resolved', 'Rejected'];

    if (isLoading) {
        return <span className="loading loading-infinity loading-xl block mx-auto mt-20"></span>;
    }

    return (
        <div className='p-4'>
            <h2 className="text-4xl font-bold mb-6">My Reported Issues ({myIssues.length})</h2>
            
            <div className="mb-6 flex gap-4">
                <select name="category" value={filters.category} onChange={handleFilterChange} className="select select-bordered w-full max-w-xs">
                    <option value="">Filter by Category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select name="status" value={filters.status} onChange={handleFilterChange} className="select select-bordered w-full max-w-xs">
                    <option value="">Filter by Status</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title & Category</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myIssues.map((issue, index) => (
                            <tr key={issue._id}>
                                <th>{index + 1}</th>
                                <td>
                                    <span className="font-bold">{issue.title}</span>
                                    <br /><span className="badge badge-sm badge-outline">{issue.category}</span>
                                </td>
                                <td>{issue.location}</td>
                                <td><span className={`badge badge-lg ${issue.status === 'Resolved' ? 'badge-success' : issue.status === 'Pending' ? 'badge-info' : 'badge-warning'} text-white`}>{issue.status}</span></td>
                                <td><span className={`font-bold ${issue.priority === 'High' ? 'text-red-500' : 'text-gray-500'}`}>{issue.priority}</span></td>
                                <td className="space-x-2">
                                    <Link to={`/issue/${issue._id}`} className="btn btn-sm btn-info tooltip" data-tip="View Details"><FaEye /></Link>
                                    
                                    {issue.status === 'Pending' && (
                                        <button 
                                            onClick={() => handleEdit(issue)}
                                            className="btn btn-sm btn-warning tooltip" data-tip="Edit Issue"
                                            disabled={deleteMutation.isPending}
                                        >
                                            <FaEdit />
                                        </button>
                                    )}
                                    {issue.status === 'Pending' && (
                                        <button 
                                            onClick={() => handleDelete(issue._id)} 
                                            className="btn btn-sm btn-error tooltip" data-tip="Delete Issue"
                                            disabled={deleteMutation.isPending}
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
           
            {isModalOpen && selectedIssue && (
                <EditIssueModal 
                    issue={selectedIssue} 
                    onClose={() => {setIsModalOpen(false); setSelectedIssue(null);}} 
                    refetch={refetch}
                />
            )}
        </div>
    );
};

export default MyIssues;