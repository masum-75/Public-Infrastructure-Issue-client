import React from 'react';
import { FaMapMarkerAlt, FaRegHeart, FaHeart } from 'react-icons/fa';
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
            case 'Resolved': return 'badge-success';
            case 'In-Progress':
            case 'Working': return 'badge-warning';
            case 'Rejected': return 'badge-error';
            case 'Pending':
            default: return 'badge-info';
        }
    };

   
    const upvoteMutation = useMutation({
        mutationFn: (issueId) => {
            return axiosSecure.patch(`/issues/${issueId}/upvote`);
        },
        onSuccess: (data) => {
            
            if (data.data.modifiedCount > 0) {
                queryClient.invalidateQueries({ queryKey: ['issues', issue._id] }); 
                refetchIssues(); 
                Swal.fire('Success!', 'Issue upvoted successfully.', 'success');
            }
        },
        onError: (error) => {
            if (error.response.status === 409) {
                Swal.fire('Error', 'You have already upvoted this issue.', 'error');
            } else if (error.response.status === 403) {
                 Swal.fire('Error', 'You cannot upvote your own issue or you are blocked.', 'error');
            } else {
                 Swal.fire('Error', 'Failed to upvote.', 'error');
            }
        }
    });

    const handleUpvote = (issueId) => {
        if (!user) {
            Swal.fire({
                title: 'Login Required',
                text: 'You need to log in to upvote an issue.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Go to Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login', { state: { from: `/all-issues` } });
                }
            });
            return;
        }
        if(isBlocked){
            Swal.fire('Blocked', 'You are currently blocked and cannot upvote.', 'error');
            return;
        }

        upvoteMutation.mutate(issueId);
    };
    
    
    const isOwner = user?.email === issue.citizenEmail;
    
    return (
        <div className={`card bg-base-100 shadow-xl border ${issue.priority === 'High' ? 'border-red-500/50' : 'border-gray-200'} h-full flex flex-col`}>
            <figure className='relative h-48 overflow-hidden'>
                <img 
                    src={issue.imageUrl} 
                    alt={issue.title} 
                    className="w-full h-full object-cover"
                />
                <div className={`badge absolute top-3 right-3 ${getStatusColor(issue.status)} text-white`}>
                    {issue.status}
                </div>
                {issue.priority === 'High' && (
                    <div className='badge absolute top-3 left-3 badge-error text-white font-bold'>
                        BOOSTED
                    </div>
                )}
            </figure>
            
            <div className="card-body p-4 flex flex-col justify-between flex-grow">
                <div>
                    <h2 className="card-title text-xl mb-2">
                        {issue.title}
                        <div className="badge badge-outline badge-primary">{issue.category}</div>
                    </h2>
                    <p className='text-sm text-gray-500 flex items-center mb-3'>
                        <FaMapMarkerAlt className="mr-1 text-primary" /> {issue.location}
                    </p>
                    <p className='text-sm line-clamp-2'>{issue.description}</p>
                </div>

                <div className="card-actions justify-between items-center mt-4 border-t pt-3">
                    <button 
                        onClick={() => handleUpvote(issue._id)}
                        disabled={upvoteMutation.isPending || isOwner || isBlocked}
                        className={`btn btn-sm ${issue.hasUpvoted ? 'btn-error' : 'btn-outline btn-error'} transition-all`}
                    >
                        {issue.hasUpvoted ? <FaHeart /> : <FaRegHeart />}
                        Upvote ({issue.upvotes})
                    </button>
                    
                    <Link to={`/issue/${issue._id}`} className="btn btn-sm btn-primary text-black">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default IssueCard;