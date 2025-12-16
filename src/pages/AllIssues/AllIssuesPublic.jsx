import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import IssueCard from '../../components/IssueCard/IssueCard';


const categories = ['Pothole', 'Streetlight', 'Water Leakage', 'Garbage Overflow', 'Damaged Footpath'];
const statuses = ['Pending', 'In-Progress', 'Resolved', 'Rejected'];
const priorities = ['Normal', 'High'];

const AllIssuesPublic = () => {
    const axiosInstance = useAxios();
    
    
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        status: '',
        priority: '',
        page: 1,
        limit: 10,
    });
    const [tempSearch, setTempSearch] = useState(''); 

    
    const { data: issueData = {}, isLoading, refetch } = useQuery({
        queryKey: ['public-issues', filters],
        queryFn: async () => {
            const params = new URLSearchParams(filters);
            
            const res = await axiosInstance.get(`/issues/all?${params.toString()}`);
            return res.data; 
        },
        placeholderData: (previousData) => previousData, 
    });

    const issues = issueData.issues || [];
    const totalPages = issueData.totalPages || 1;
    const currentPage = issueData.currentPage || 1;

    const handleFilterChange = (e) => {
        setFilters(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
            page: 1, 
        }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setFilters(prev => ({
            ...prev,
            search: tempSearch,
            page: 1, 
        }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setFilters(prev => ({ ...prev, page: newPage }));
        }
    };
    
    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-4xl font-bold mb-8 text-center text-primary">All Reported Issues ({issueData.total || 0})</h2>

            
            <div className="mb-8 p-6 bg-base-200 rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-5 gap-4">
               
                <form onSubmit={handleSearchSubmit} className='col-span-full lg:col-span-2'>
                    <div className="join w-full">
                        <input
                            type="text"
                            placeholder="Search by Title or Location"
                            className="input input-bordered join-item w-full"
                            value={tempSearch}
                            onChange={(e) => setTempSearch(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary join-item text-black">Search</button>
                    </div>
                </form>

                
                <select name="category" value={filters.category} onChange={handleFilterChange} className="select select-bordered w-full">
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

               
                <select name="status" value={filters.status} onChange={handleFilterChange} className="select select-bordered w-full">
                    <option value="">All Statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

               
                <select name="priority" value={filters.priority} onChange={handleFilterChange} className="select select-bordered w-full">
                    <option value="">All Priorities</option>
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

           
            {isLoading ? (
                <div className='flex justify-center items-center h-48'>
                    <span className="loading loading-infinity loading-xl"></span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {issues.length > 0 ? (
                        issues.map(issue => <IssueCard key={issue._id} issue={issue} refetchIssues={refetch} />)
                    ) : (
                        <p className='col-span-full text-center text-gray-500'>No issues found matching the criteria.</p>
                    )}
                </div>
            )}

           
            {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                    <div className="join">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1 || isLoading}
                            className="join-item btn"
                        >
                            «
                        </button>
                        <button className="join-item btn">Page {currentPage} of {totalPages}</button>
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages || isLoading}
                            className="join-item btn"
                        >
                            »
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllIssuesPublic;