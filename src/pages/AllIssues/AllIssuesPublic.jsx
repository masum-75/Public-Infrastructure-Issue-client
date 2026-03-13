import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import useAxios from '../../hooks/useAxios';
import IssueCard from '../../components/IssueCard/IssueCard';

const CATEGORIES = ['Pothole', 'Streetlight', 'Water Leakage', 'Garbage Overflow', 'Damaged Footpath'];
const STATUSES = ['Pending', 'In-Progress', 'Resolved', 'Rejected'];
const PRIORITIES = ['Normal', 'High'];

const SkeletonCard = () => (
    <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden animate-pulse">
        <div className="h-52 bg-slate-800" />
        <div className="p-6 space-y-3">
            <div className="h-3 w-20 bg-slate-800 rounded-full" />
            <div className="h-5 w-full bg-slate-800 rounded-full" />
            <div className="h-4 w-32 bg-slate-800 rounded-full mt-1" />
            <div className="h-4 w-full bg-slate-800 rounded-full" />
            <div className="h-4 w-2/3 bg-slate-800 rounded-full" />
            <div className="h-px w-full bg-slate-800/60 mt-4" />
            <div className="flex justify-between mt-2">
                <div className="h-6 w-16 bg-slate-800 rounded-lg" />
                <div className="h-6 w-20 bg-slate-800 rounded-lg" />
            </div>
        </div>
    </div>
);

const SelectField = ({ label, name, value, onChange, options, placeholder }) => (
    <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full h-11 bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 text-sm font-semibold text-slate-300 focus:outline-none transition-all cursor-pointer appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
            <option value="">{placeholder}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const AllIssuesPublic = () => {
    const axiosInstance = useAxios();
    const [showFilters, setShowFilters] = useState(false);

    const initialFilters = { search: '', category: '', status: '', priority: '', page: 1, limit: 9 };
    const [filters, setFilters] = useState(initialFilters);
    const [tempSearch, setTempSearch] = useState('');

    const { data: issueData = {}, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['public-issues', filters],
        queryFn: async () => {
            const params = new URLSearchParams(filters);
            const res = await axiosInstance.get(`/issues/all?${params.toString()}`);
            return res.data;
        },
        placeholderData: (prev) => prev,
        staleTime: 5000,
    });

    const issues = issueData.issues || [];
    const totalPages = issueData.totalPages || 1;
    const currentPage = issueData.currentPage || 1;

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

    const hasActiveFilters = filters.category || filters.status || filters.priority || filters.search;

    return (
        <div className="min-h-screen bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">

                {/* Page Header */}
                <header className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-5">
                        <SlidersHorizontal className="text-blue-400 w-3.5 h-3.5" />
                        <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">Public Directory</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                        Infrastructure <span className="text-blue-400">Issue Tracker</span>
                    </h1>
                    <div className="flex justify-center items-center gap-4">
                        <span className="h-px w-10 bg-slate-800" />
                        <p className="text-slate-500 font-semibold uppercase tracking-widest text-xs">
                            {issueData.total || 0} Reports Documented
                        </p>
                        <span className="h-px w-10 bg-slate-800" />
                    </div>
                </header>

                {/* Filter Bar */}
                <div className="mb-10 bg-slate-900 border border-slate-800/60 rounded-2xl p-5">
                    {/* Search Row */}
                    <div className="flex gap-3 mb-4">
                        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by location, title, or description..."
                                    className="w-full h-11 bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-11 pr-5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none transition-all"
                                    value={tempSearch}
                                    onChange={(e) => setTempSearch(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="h-11 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm shrink-0"
                            >
                                Search
                            </button>
                        </form>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`h-11 px-4 rounded-xl border font-bold text-sm flex items-center gap-2 transition-all shrink-0 ${showFilters
                                ? 'bg-blue-600/10 border-blue-500/30 text-blue-400'
                                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                                }`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="hidden sm:inline">Filters</span>
                            {hasActiveFilters && (
                                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                            )}
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className="h-11 px-4 rounded-xl border border-slate-700/60 bg-slate-800/60 text-slate-400 hover:text-red-400 hover:border-red-500/30 font-bold text-sm flex items-center gap-2 transition-all shrink-0"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Reset</span>
                            </button>
                        )}
                    </div>

                    {/* Dropdown Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/60">
                            <SelectField
                                label="Category"
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                options={CATEGORIES}
                                placeholder="All Categories"
                            />
                            <SelectField
                                label="Status"
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                options={STATUSES}
                                placeholder="Any Status"
                            />
                            <SelectField
                                label="Priority"
                                name="priority"
                                value={filters.priority}
                                onChange={handleFilterChange}
                                options={PRIORITIES}
                                placeholder="All Priorities"
                            />
                        </div>
                    )}

                    {/* Active filter tags */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/60">
                            {[
                                { key: 'search', label: `"${filters.search}"` },
                                { key: 'category', label: filters.category },
                                { key: 'status', label: filters.status },
                                { key: 'priority', label: filters.priority },
                            ].filter(f => f.label).map(({ key, label }) => (
                                <span
                                    key={key}
                                    onClick={() => setFilters(prev => ({ ...prev, [key]: '', page: 1 }))}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-lg cursor-pointer hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all"
                                >
                                    {label}
                                    <span className="text-[10px]">✕</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : issues.length > 0 ? (
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                        {issues.map(issue => (
                            <IssueCard key={issue._id} issue={issue} refetchIssues={refetch} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-slate-900/40 border border-dashed border-slate-700/60 rounded-3xl">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <AlertCircle className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No issues found</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                            No results match your current filters. Try broadening your search.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-14">
                        <div className="inline-flex items-center gap-1 p-1.5 bg-slate-900 border border-slate-800/60 rounded-2xl">
                            <button
                                onClick={() => setFilters(p => ({ ...p, page: currentPage - 1 }))}
                                disabled={currentPage === 1 || isFetching}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                .reduce((acc, p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((item, idx) =>
                                    item === '...'
                                        ? <span key={`ellipsis-${idx}`} className="px-2 text-slate-600 text-sm">…</span>
                                        : <button
                                            key={item}
                                            onClick={() => setFilters(p => ({ ...p, page: item }))}
                                            disabled={isFetching}
                                            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${currentPage === item
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                                }`}
                                        >
                                            {item}
                                        </button>
                                )
                            }

                            <button
                                onClick={() => setFilters(p => ({ ...p, page: currentPage + 1 }))}
                                disabled={currentPage === totalPages || isFetching}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllIssuesPublic;