import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import Swal from 'sweetalert2';
import { 
    FaMapMarkerAlt, FaCalendarAlt, FaStar, FaRegStar, 
    FaRegEdit, FaTrash, FaLevelUpAlt, FaSpinner, 
    FaHeart, FaRegHeart, FaHistory, FaUserShield 
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const IssueDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { role, isBlocked } = useRole();
    const queryClient = useQueryClient();

    // Data Fetching
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
        mutationFn: (boostData) => axiosSecure.post('/boost-checkout-session', boostData),
        onSuccess: (res) => { window.location.href = res.data.url; },
        onError: () => { Swal.fire('Error', 'Failed to initiate boost payment.', 'error'); }
    });

    const deleteMutation = useMutation({
        mutationFn: (issueId) => axiosSecure.delete(`/dashboard/my-issues/${issueId}`),
        onSuccess: (res) => {
            if (res.data.deletedCount > 0) {
                Swal.fire('Deleted!', 'Issue removed successfully.', 'success');
                navigate('/dashboard/my-issues');
            }
        }
    });

   
    const handleBoostIssue = () => {
        if (issue.priority === 'High') return Swal.fire('Info', 'Already boosted.', 'info');
        if (isBlocked) return Swal.fire('Blocked!', 'Your account is restricted.', 'error');

        Swal.fire({
            title: "Upgrade Priority?",
            text: "Boost this issue to 'High' for 100 Taka?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: "Proceed to Payment"
        }).then((result) => {
            if (result.isConfirmed) {
                boostMutation.mutate({ issueId: id, title: issue.title, cost: 100 });
            }
        });
    };

    const handleDelete = () => {
        Swal.fire({
            title: 'Permanent Delete?',
            text: "Only 'Pending' issues can be removed.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Confirm Delete'
        }).then((result) => {
            if (result.isConfirmed) deleteMutation.mutate(id);
        });
    };

    if (issueLoading) {
        return (
            <div className='flex flex-col justify-center items-center h-[60vh] gap-4'>
                <FaSpinner className="animate-spin text-5xl text-primary" />
                <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Loading Details</p>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        const styles = {
            'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'In-Progress': 'bg-amber-100 text-amber-700 border-amber-200',
            'Rejected': 'bg-rose-100 text-rose-700 border-rose-200',
            'Pending': 'bg-sky-100 text-sky-700 border-sky-200'
        };
        return styles[status] || styles['Pending'];
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen">
         
            <div className="mb-8">
                <nav className="text-sm font-medium text-slate-400 mb-2">Issues / {issue.category}</nav>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">{issue.title}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
               
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                        <img src={issue.imageUrl} alt={issue.title} className="w-full h-[450px] object-cover" />
                        
                        <div className="p-8">
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusStyle(issue.status)}`}>
                                    {issue.status}
                                </span>
                                <div className={`flex items-center gap-2 font-black ${issue.priority === 'High' ? 'text-rose-500' : 'text-slate-400'}`}>
                                    {issue.priority === 'High' ? <FaStar /> : <FaRegStar />}
                                    <span className="uppercase tracking-wider text-sm">Priority: {issue.priority}</span>
                                </div>
                            </div>

                            <p className="text-slate-600 text-lg leading-relaxed mb-8">{issue.description}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white rounded-xl shadow-sm"><FaMapMarkerAlt className="text-primary" /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Location</p>
                                        <p className="font-bold text-slate-700">{issue.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white rounded-xl shadow-sm"><FaCalendarAlt className="text-primary" /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Reported On</p>
                                        <p className="font-bold text-slate-700">{new Date(issue.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {issue.assignedStaffEmail && (
                                <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                                    <div className="bg-blue-500 p-3 rounded-xl text-white"><FaUserShield /></div>
                                    <div>
                                        <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest mb-1">Assigned Official</h4>
                                        <p className="font-bold text-blue-800">{issue.assignedStaffName || 'Support Team'}</p>
                                        <p className="text-sm text-blue-600">{issue.assignedStaffEmail}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                  
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-8">
                            <FaHistory className="text-primary text-2xl" />
                            <h2 className="text-2xl font-black text-slate-800">Tracking Progress</h2>
                        </div>
                        
                        {timelineLoading ? (
                            <div className="py-10 text-center"><span className="loading loading-dots loading-md text-primary"></span></div>
                        ) : (
                            <ul className="timeline timeline-vertical timeline-compact">
                                {timeline.map((log, idx) => (
                                    <li key={log._id}>
                                        <hr className={idx === 0 ? 'bg-transparent' : 'bg-slate-200'} />
                                        <div className="timeline-middle">
                                            <div className="w-4 h-4 rounded-full border-4 border-white bg-primary shadow-sm"></div>
                                        </div>
                                        <div className="timeline-end mb-10 ml-4">
                                            <time className="text-[10px] font-bold text-slate-400 uppercase">{new Date(log.createdAt).toLocaleString()}</time>
                                            <div className="text-sm font-black text-slate-800 uppercase mt-0.5">{log.status}</div>
                                            <p className="text-slate-500 text-sm mt-1">{log.message}</p>
                                            <p className="text-[10px] font-medium text-slate-400 mt-2">Update by: {log.staffName || log.updatedBy}</p>
                                        </div>
                                        {idx !== timeline.length - 1 && <hr className="bg-slate-200" />}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                
                <div className="lg:col-span-4 sticky top-8 space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                            Citizen <span className="text-primary">Portal</span>
                        </h3>
                        
                        <div className="mb-8 p-6 bg-slate-50 rounded-2xl text-center border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Upvote Status</p>
                            <div className={`flex items-center justify-center gap-2 text-xl font-black ${issue.hasUpvoted ? 'text-rose-500' : 'text-slate-300'}`}>
                                {issue.hasUpvoted ? <FaHeart /> : <FaRegHeart />}
                                <span>{issue.hasUpvoted ? 'Endorsed' : 'Not Upvoted'}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-400 mt-2">{issue.upvotes} total citizens supported</p>
                        </div>

                        <div className="space-y-3">
                            {isOwner && issue.status === 'Pending' && (
                                <>
                                    <button 
                                        onClick={() => navigate(`/dashboard/my-issues?edit=${id}`)} 
                                        className="btn btn-warning w-full rounded-xl font-black shadow-md shadow-amber-100 border-none h-14"
                                    >
                                        <FaRegEdit /> Edit Report
                                    </button>
                                    <button 
                                        onClick={handleDelete} 
                                        className="btn btn-ghost w-full rounded-xl font-black text-rose-500 hover:bg-rose-50 h-14 border border-rose-100"
                                        disabled={deleteMutation.isPending}
                                    >
                                        <FaTrash /> Remove Issue
                                    </button>
                                </>
                            )}
                            
                            {isOwner && issue.priority !== 'High' && (
                                <button 
                                    onClick={handleBoostIssue} 
                                    className="btn btn-primary w-full rounded-xl font-black h-14 shadow-lg shadow-sky-100 border-none"
                                    disabled={boostMutation.isPending || isBlocked}
                                >
                                    {boostMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaLevelUpAlt />}
                                    Boost to High Priority
                                </button>
                            )}
                            
                            {!isOwner && (
                                <div className="text-center p-4">
                                    <p className="text-xs font-bold text-slate-400 italic">Limited actions for viewing public records.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetails;