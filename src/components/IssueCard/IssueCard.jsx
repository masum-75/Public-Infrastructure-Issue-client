import React from 'react';
import { FaMapMarkerAlt, FaRegHeart, FaHeart, FaArrowRight } from 'react-icons/fa';

import { Link, useNavigate } from 'react-router'; 
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useRole from '../../hooks/useRole';

const IssueCard = ({ issue, refetchIssues }) => {
    const { user } = useAuth();
    const { isBlocked } = useRole();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-emerald-500 text-white';
            case 'In-Progress':
            case 'Working': return 'bg-amber-500 text-white';
            case 'Rejected': return 'bg-rose-500 text-white';
            case 'Pending':
            default: return 'bg-sky-500 text-white';
        }
    };

    const upvoteMutation = useMutation({
        mutationFn: (issueId) => axiosSecure.patch(`/issues/${issueId}/upvote`),
        onSuccess: (data) => {
            if (data.data.modifiedCount > 0) {
                queryClient.invalidateQueries({ queryKey: ['issues'] }); 
                refetchIssues(); 
                Swal.fire({ icon: 'success', title: 'Upvoted!', timer: 1500, showConfirmButton: false });
            }
        },
        onError: (error) => {
            const status = error.response?.status;
            if (status === 409) Swal.fire('Error', 'Already upvoted!', 'error');
            else if (status === 403) Swal.fire('Error', 'Access denied!', 'error');
            else Swal.fire('Error', 'Failed to upvote.', 'error');
        }
    });

    const handleUpvote = (issueId) => {
        if (!user) {
            Swal.fire({
                title: 'Login Required',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Go to Login'
            }).then((result) => {
                if (result.isConfirmed) navigate('/login', { state: { from: `/all-issues` } });
            });
            return;
        }
        if(isBlocked) return Swal.fire('Blocked', 'You cannot upvote.', 'error');
        upvoteMutation.mutate(issueId);
    };

    const isOwner = user?.email === issue.citizenEmail;
    
    return (
        <div className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-xl flex flex-col h-full">
            {/* Image Section */}
            <figure className='relative h-56 overflow-hidden'>
                <img 
                    src={issue.imageUrl || 'https://via.placeholder.com/400x250?text=No+Image'} 
                    alt={issue.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg ${getStatusColor(issue.status)}`}>
                    {issue.status}
                </div>
                {issue.priority === 'High' && (
                    <div className='absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse'>
                        Urgent
                    </div>
                )}
            </figure>
            
            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-2 py-0.5 bg-blue-500/10 rounded-md">
                            {issue.category}
                        </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {issue.title}
                    </h2>
                    <p className='text-slate-400 text-xs flex items-center mb-4 italic'>
                        <FaMapMarkerAlt className="mr-1.5 text-rose-500" /> {issue.location}
                    </p>
                    <p className='text-slate-400 text-sm line-clamp-2 leading-relaxed'>
                        {issue.description}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-800">
                    <button 
                        onClick={() => handleUpvote(issue._id)}
                        disabled={upvoteMutation.isPending || isOwner || isBlocked}
                        className={`flex items-center gap-2 text-sm font-bold transition-all ${issue.hasUpvoted ? 'text-rose-500' : 'text-slate-500 hover:text-rose-400'}`}
                    >
                        {issue.hasUpvoted ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
                        <span>{issue.upvotes}</span>
                    </button>
                    
                    <Link 
                        to={`/issue/${issue._id}`} 
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors group/btn"
                    >
                        View Case <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default IssueCard;