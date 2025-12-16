import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import Swal from 'sweetalert2';
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaRegStar, FaRegEdit, FaTrash, FaLevelUpAlt, FaSpinner } from 'react-icons/fa';

const IssueDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { role, isBlocked } = useRole();
    const queryClient = useQueryClient();

    const { data: issue = {}, isLoading: issueLoading, refetch: refetchIssue } = useQuery({
        queryKey: ['issues', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/issues/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
    
    
    const { data: timeline = [], isLoading: timelineLoading } = useQuery({
        queryKey: ['timeline', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/trackings/${id}/logs`);
            return res.data;
        },
        enabled: !!id,
    });

    const isOwner = user?.email === issue.citizenEmail;
    
    
    const boostMutation = useMutation({
        mutationFn: (boostData) => {
            return axiosSecure.post('/boost-checkout-session', boostData);
        },
        onSuccess: (res) => {
           
            window.location.href = res.data.url;
        },
        onError: () => {
             Swal.fire('Error', 'Failed to initiate boost payment.', 'error');
        }
    });

    const handleBoostIssue = () => {
        if (issue.priority === 'High') {
            Swal.fire('Info', 'This issue is already boosted.', 'info');
            return;
        }
        if (isBlocked) {
             Swal.fire('Blocked!', 'You are currently blocked and cannot boost an issue.', 'error');
             return;
        }

        const boostCost = 100; 
        
        Swal.fire({
            title: "Boost Issue Priority?",
            text: `You will pay ${boostCost} Taka to set this issue's priority to High.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm Boost Payment"
        }).then((result) => {
            if (result.isConfirmed) {
                const boostData = {
                    issueId: id,
                    title: issue.title,
                    cost: boostCost 
                };
                boostMutation.mutate(boostData);
            }
        });
    };
    
 
    const deleteMutation = useMutation({
        mutationFn: (issueId) => {
          
            return axiosSecure.delete(`/dashboard/my-issues/${issueId}`);
        },
        onSuccess: (res) => {
            if (res.data.deletedCount > 0) {
                Swal.fire('Deleted!', 'Your issue has been deleted.', 'success');
                navigate('/dashboard/my-issues'); 
            } else {
                Swal.fire('Error', 'Could not delete issue. Status must be Pending.', 'error');
            }
        },
        onError: () => {
             Swal.fire('Error', 'Failed to delete. Check issue status.', 'error');
        }
    });

    const handleDelete = () => {
        Swal.fire({
            title: 'Confirm Deletion?',
            text: "You can only delete issues with 'Pending' status.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete It'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    if (issueLoading || !issue.title) {
        return <div className='flex justify-center items-center h-96'><FaSpinner className="animate-spin text-4xl text-primary" /></div>;
    }
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-success';
            case 'In-Progress':
            case 'Working': return 'bg-warning';
            case 'Rejected': return 'bg-error';
            case 'Pending':
            default: return 'bg-info';
        }
    };
    
    return (
        <div className="max-w-6xl mx-auto p-4 lg:p-8">
            <h1 className="text-4xl font-extrabold mb-3 text-secondary">{issue.title}</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg space-y-4">
                    <img src={issue.imageUrl} alt={issue.title} className="w-full h-80 object-cover rounded-lg mb-4" />
                    
                    <div className="flex justify-between items-center border-b pb-3">
                        <div className={`badge text-white text-lg p-3 ${getStatusColor(issue.status)}`}>{issue.status}</div>
                        <div className={`text-xl font-bold flex items-center ${issue.priority === 'High' ? 'text-red-500' : 'text-gray-500'}`}>
                            {issue.priority === 'High' ? <FaStar className="mr-1" /> : <FaRegStar className="mr-1" />}
                            Priority: {issue.priority}
                        </div>
                    </div>
                    
                    <p className="text-gray-700 text-lg">{issue.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <p className="text-sm flex items-center"><FaMapMarkerAlt className="text-primary mr-2" /> **Location:** {issue.location}</p>
                        <p className="text-sm flex items-center"><FaCalendarAlt className="text-primary mr-2" /> **Reported:** {new Date(issue.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm">**Category:** <span className="font-semibold">{issue.category}</span></p>
                        <p className="text-sm">**Upvotes:** <span className="font-semibold text-red-500">{issue.upvotes}</span></p>
                    </div>

                   
                    {issue.assignedStaffEmail && (
                        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                            <h4 className="font-bold text-blue-700">Assigned Staff</h4>
                            <p className="text-sm">**Name:** {issue.assignedStaffName || 'N/A'}</p>
                            <p className="text-sm">**Email:** {issue.assignedStaffEmail}</p>
                        </div>
                    )}
                </div>

             
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit space-y-4 border-t-4 border-primary">
                    <h3 className="text-2xl font-bold border-b pb-3">Citizen Actions</h3>
                    
                    <div className="p-3 bg-gray-100 rounded-lg text-center">
                        <p className="font-semibold">Your Upvote Status:</p>
                        <p className={`text-lg font-bold ${issue.hasUpvoted ? 'text-red-500' : 'text-gray-400'}`}>
                            {issue.hasUpvoted ? <><FaHeart className="inline mr-1" /> Upvoted</> : <><FaRegHeart className="inline mr-1" /> Not Yet Upvoted</>}
                        </p>
                    </div>

                   
                    {isOwner && issue.status === 'Pending' && (
                        <>
                            <button onClick={() => navigate(`/dashboard/my-issues?edit=${id}`)} className="btn btn-warning w-full text-black flex items-center"><FaRegEdit className="mr-2" /> Edit Issue (Pending)</button>
                            <button onClick={handleDelete} className="btn btn-error w-full text-white flex items-center" disabled={deleteMutation.isPending}><FaTrash className="mr-2" /> Delete Issue</button>
                        </>
                    )}
                    
                  
                    {isOwner && issue.priority !== 'High' && (
                        <button onClick={handleBoostIssue} className="btn btn-info w-full text-white flex items-center" disabled={boostMutation.isPending || isBlocked}>
                            {boostMutation.isPending ? <FaSpinner className="animate-spin mr-2" /> : <FaLevelUpAlt className="mr-2" />}
                            Boost Priority (100 Taka)
                        </button>
                    )}
                </div>
            </div>

            {/* Tracking Timeline Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-primary border-b pb-3">Issue Tracking & Timeline</h2>
                
                {timelineLoading ? (
                    <div className='flex justify-center items-center h-40'><FaSpinner className="animate-spin text-4xl text-primary" /></div>
                ) : (
                    <ul className="timeline timeline-snap-icon timeline-vertical">
                        {timeline.map((log, index) => (
                            <li key={log._id}>
                                <div className="timeline-middle">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                </div>
                                <div className={`timeline-${index % 2 === 0 ? 'start' : 'end'} md:text-end mb-10`}>
                                    <time className="font-mono italic text-sm text-gray-500">{new Date(log.createdAt).toLocaleString()}</time>
                                    <div className={`text-lg font-black mt-1 ${getStatusColor(log.status)} p-1 rounded-sm text-white inline-block`}>
                                        {log.status}
                                    </div>
                                    <div className="text-md font-semibold mt-1">
                                        {log.message}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Updated by: <span className='font-bold'>{log.updatedBy}</span> {log.staffName && `(${log.staffName})`}
                                    </p>
                                </div>
                                {index < timeline.length - 1 && <hr />}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default IssueDetails;