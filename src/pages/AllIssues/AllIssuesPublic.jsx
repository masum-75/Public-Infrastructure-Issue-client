import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    Search, 
    SlidersHorizontal, 
    AlertCircle, 
    ChevronLeft, 
    ChevronRight,
    RotateCcw 
} from 'lucide-react';
import useAxios from '../../hooks/useAxios';
import IssueCard from '../../components/IssueCard/IssueCard';

const CATEGORIES = ['Pothole', 'Streetlight', 'Water Leakage', 'Garbage Overflow', 'Damaged Footpath'];
const STATUSES = ['Pending', 'In-Progress', 'Resolved', 'Rejected'];
const PRIORITIES = ['Normal', 'High'];

const AllIssuesPublic = () => {
    const axiosInstance = useAxios();
    
    
    const initialFilters = {
        search: '',
        category: '',
        status: '',
        priority: '',
        page: 1,
        limit: 9, 
    };

    const [filters, setFilters] = useState(initialFilters);
    const [tempSearch, setTempSearch] = useState(''); 

  
    const { data: issueData = {}, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['public-issues', filters],
        queryFn: async () => {
            const params = new URLSearchParams(filters);
            const res = await axiosInstance.get(`/issues/all?${params.toString()}`);
            return res.data; 
        },
        placeholderData: (previousData) => previousData,
        staleTime: 5000, 
    });

    const issues = issueData.issues || [];
    const totalPages = issueData.totalPages || 1;
    const currentPage = issueData.currentPage || 1;

    // Handlers
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: tempSearch, page: 1 }));
    };

    const resetFilters = () => {
        setTempSearch('');
        setFilters(initialFilters);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-white min-h-screen">
            
            {/* Header Section */}
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    Public Issue <span className="text-primary">Directory</span>
                </h1>
                <div className="flex justify-center items-center gap-4">
                    <span className="h-px w-10 bg-slate-200"></span>
                    <p className="text-slate-500 font-semibold uppercase tracking-widest text-xs">
                        {issueData.total || 0} Reports Documented
                    </p>
                    <span className="h-px w-10 bg-slate-200"></span>
                </div>
            </header>

            {/* Filter Bar */}
            <div className="mb-12 p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4 items-end">
                    
                    {/* Search Field */}
                    <form onSubmit={handleSearchSubmit} className='flex-1 w-full'>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-2">Search Reports</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                            <input
                                type="text"
                                placeholder="Location, title or description..."
                                className="input input-bordered w-full pl-12 h-12 rounded-xl border-slate-200 focus:outline-primary font-medium text-slate-700 bg-white"
                                value={tempSearch}
                                onChange={(e) => setTempSearch(e.target.value)}
                            />
                        </div>
                    </form>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
                        <div className="min-w-[140px]">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-2">Category</label>
                            <select name="category" value={filters.category} onChange={handleFilterChange} className="select select-bordered w-full h-12 rounded-xl border-slate-200 font-semibold text-slate-600">
                                <option value="">All Types</option>
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div className="min-w-[140px]">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-2">Status</label>
                            <select name="status" value={filters.status} onChange={handleFilterChange} className="select select-bordered w-full h-12 rounded-xl border-slate-200 font-semibold text-slate-600">
                                <option value="">Any Status</option>
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="min-w-[140px]">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-2">Priority</label>
                            <select name="priority" value={filters.priority} onChange={handleFilterChange} className="select select-bordered w-full h-12 rounded-xl border-slate-200 font-semibold text-slate-600">
                                <option value="">All Priority</option>
                                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>

                        {/* Reset Button */}
                        <div className="flex items-end">
                            <button 
                                onClick={resetFilters}
                                className="btn btn-ghost h-12 min-h-12 w-full rounded-xl border border-slate-200 hover:bg-slate-100 gap-2"
                                title="Reset Filters"
                            >
                                <RotateCcw className="size-4" />
                                <span className="md:hidden lg:inline text-xs font-bold">RESET</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className='flex flex-col justify-center items-center h-80'>
                    <span className="loading loading-ring loading-lg text-primary"></span>
                    <p className="mt-4 font-bold text-slate-400 text-sm animate-pulse">SYNCHRONIZING DATA...</p>
                </div>
            ) : (
                <>
                    {issues.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {issues.map(issue => (
                                <IssueCard key={issue._id} issue={issue} refetchIssues={refetch} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                            <div className="bg-white p-4 rounded-full w-fit mx-auto shadow-sm mb-6">
                                <AlertCircle className="size-10 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">No issues found</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-2">
                                We couldn't find any results matching your current filters. Try broadening your search.
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-20 mb-10">
                    <div className="inline-flex items-center p-1 bg-slate-100 rounded-2xl gap-1">
                        <button 
                            onClick={() => setFilters(p => ({...p, page: currentPage - 1}))} 
                            disabled={currentPage === 1 || isFetching}
                            className="btn btn-ghost btn-square rounded-xl disabled:bg-transparent"
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                        
                        <div className="px-6 text-sm font-black text-slate-700">
                            {currentPage} <span className="text-slate-400 mx-1">/</span> {totalPages}
                        </div>

                        <button 
                            onClick={() => setFilters(p => ({...p, page: currentPage + 1}))} 
                            disabled={currentPage === totalPages || isFetching}
                            className="btn btn-ghost btn-square rounded-xl disabled:bg-transparent"
                        >
                            <ChevronRight className="size-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllIssuesPublic;