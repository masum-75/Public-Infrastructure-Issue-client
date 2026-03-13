import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaArrowRight,
  FaLayerGroup,
} from "react-icons/fa";
import { Link } from "react-router";

const SkeletonCard = () => (
  <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-52 bg-slate-800" />
    <div className="p-6 space-y-3">
      <div className="h-3 w-20 bg-slate-800 rounded-full" />
      <div className="h-5 w-full bg-slate-800 rounded-full" />
      <div className="h-5 w-3/4 bg-slate-800 rounded-full" />
      <div className="h-4 w-32 bg-slate-800 rounded-full mt-2" />
      <div className="h-px w-full bg-slate-800 mt-4" />
      <div className="h-9 w-full bg-slate-800 rounded-xl mt-2" />
    </div>
  </div>
);

const LatestResolvedIssues = () => {
  const axiosSecure = useAxiosSecure();

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["latestResolved"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/issues/all?status=Resolved&limit=6&sort=-lastUpdatedAt`,
      );
      return res.data.issues || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div>
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-5">
          <FaCheckCircle className="text-emerald-400 text-sm" />
          <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
            Success Stories
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Latest <span className="text-emerald-400">Resolved</span> Issues
        </h2>
        <p className="text-lg text-slate-400 leading-relaxed">
          Real problems fixed by real citizens. Transforming community
          challenges into success stories.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : issues.map((issue) => (
              <div
                key={issue._id}
                className="group bg-slate-900 border border-slate-800/60 hover:border-emerald-500/25 rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden shrink-0">
                  <img
                    src={issue.imageUrl}
                    alt={issue.title}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=600";
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  {/* Status badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 backdrop-blur-sm border border-emerald-500/30 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span className="text-emerald-300 text-xs font-bold">
                      Resolved
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Category */}
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-3">
                    <FaLayerGroup className="text-[10px]" />
                    {issue.category}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                    {issue.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-5">
                    <FaMapMarkerAlt className="text-red-400 shrink-0" />
                    <span className="truncate">{issue.location}</span>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-5 border-t border-slate-800/60">
                    <Link
                      to={`/issue/${issue._id}`}
                      className="group/btn flex items-center justify-between w-full text-sm font-bold text-slate-400 hover:text-white transition-colors"
                    >
                      <span>View Full Details</span>
                      <span className="w-8 h-8 rounded-lg bg-slate-800 group-hover/btn:bg-emerald-500/20 border border-slate-700 group-hover/btn:border-emerald-500/30 flex items-center justify-center transition-all">
                        <FaArrowRight className="text-xs group-hover/btn:translate-x-0.5 transition-transform" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Empty State */}
      {!isLoading && issues.length === 0 && (
        <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-700/60 rounded-3xl">
          <FaCheckCircle className="text-slate-600 text-5xl mx-auto mb-4" />
          <p className="text-xl text-slate-500 font-semibold mb-2">
            No resolved issues yet
          </p>
          <p className="text-slate-600 text-sm">
            Be the first to report an issue in your community!
          </p>
          <Link
            to="/dashboard/report-issue"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
          >
            Report an Issue <FaArrowRight className="text-xs" />
          </Link>
        </div>
      )}

      {/* View All Link */}
      {!isLoading && issues.length > 0 && (
        <div className="text-center mt-12">
          <Link
            to="/all-issues"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white font-bold rounded-xl transition-all duration-200"
          >
            View All Resolved Issues
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default LatestResolvedIssues;
