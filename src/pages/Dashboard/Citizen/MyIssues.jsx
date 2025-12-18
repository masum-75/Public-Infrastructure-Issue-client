import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaEye, FaFilter } from 'react-icons/fa';
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
        mutationFn: (id) => axiosSecure.delete(`/dashboard/my-issues/${id}`),
        onSuccess: (res) => {
            if (res.data.deletedCount > 0) {
                Swal.fire('Deleted!', 'The issue record has been removed.', 'success');
                queryClient.invalidateQueries({ queryKey: ['myIssues'] });
            }
        },
        onError: () => Swal.fire('Error', 'Only Pending issues can be deleted.', 'error')
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Confirm Deletion?',
            text: "This action is only reversible for Pending status issues.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) deleteMutation.mutate(id);
        });
    };

    const handleEdit = (issue) => {
        setSelectedIssue(issue);
        setIsModalOpen(true);
    }

    const categories = ['Pothole', 'Streetlight', 'Water Leakage', 'Garbage Overflow', 'Damaged Footpath'];
    const statuses = ['Pending', 'In-Progress', 'Resolved', 'Rejected'];

    if (isLoading) return <div className="flex justify-center mt-20"><span className="loading loading-infinity loading-lg text-primary"></span></div>;

    return (
        <div className='p-6 bg-gray-50 min-h-screen'>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-extrabold text-gray-800">My Reported Issues <span className="text-primary">({myIssues.length})</span></h2>
                
                <div className="flex gap-3 bg-white p-2 rounded-lg shadow-sm">
                    <div className="flex items-center px-2 text-gray-400"><FaFilter /></div>
                    <select name="category" value={filters.category} onChange={(e) => setFilters(p => ({...p, category: e.target.value}))} className="select select-sm select-bordered">
                        <option value="">All Categories</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select name="status" value={filters.status} onChange={(e) => setFilters(p => ({...p, status: e.target.value}))} className="select select-sm select-bordered">
                        <option value="">All Status</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100">
                <table className="table w-full">
                    <thead className="bg-gray-100">
                        <tr className="text-gray-700">
                            <th>#</th>
                            <th>Issue Detail</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myIssues.map((issue, index) => (
                            <tr key={issue._id} className="hover:bg-gray-50 transition-colors">
                                <th className="text-gray-400">{index + 1}</th>
                                <td>
                                    <p className="font-bold text-gray-800">{issue.title}</p>
                                    <span className="badge badge-ghost badge-sm">{issue.category}</span>
                                </td>
                                <td className="text-gray-600 italic text-sm">{issue.location}</td>
                                <td>
                                    <span className={`badge badge-md font-semibold ${issue.status === 'Resolved' ? 'badge-success' : issue.status === 'Pending' ? 'badge-info' : 'badge-warning'}`}>
                                        {issue.status}
                                    </span>
                                </td>
                                <td><span className={`font-bold ${issue.priority === 'High' ? 'text-error' : 'text-gray-500'}`}>{issue.priority}</span></td>
                                <td className="flex justify-center gap-2">
                                    <Link to={`/issue/${issue._id}`} className="btn btn-square btn-sm btn-info text-white"><FaEye /></Link>
                                    {issue.status === 'Pending' && (
                                        <>
                                            <button onClick={() => handleEdit(issue)} className="btn btn-square btn-sm btn-warning"><FaEdit /></button>
                                            <button onClick={() => handleDelete(issue._id)} className="btn btn-square btn-sm btn-error text-white"><FaTrash /></button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {myIssues.length === 0 && <div className="text-center p-10 text-gray-400">No issues found matching your filters.</div>}
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