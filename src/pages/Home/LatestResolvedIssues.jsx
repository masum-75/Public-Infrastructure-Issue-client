import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaCheckCircle, FaMapMarkerAlt, FaExternalLinkAlt, FaLayerGroup } from "react-icons/fa";
import { Link } from "react-router"; 

const LatestResolvedIssues = () => {
  const axiosSecure = useAxiosSecure();

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["latestResolved"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/issues/all?status=Resolved&limit=6&sort=-lastUpdatedAt`
      );
      return res.data.issues || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  
  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex flex-col gap-4 w-full">
            <div className="skeleton h-56 w-full rounded-2xl"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Latest <span className="text-success">Resolved</span> Issues
          </h2>
          <div className="h-1.5 w-20 bg-success mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 font-medium italic">
            "Transforming community challenges into success stories, one report at a time."
          </p>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
            >
              
              <div className="relative h-60 overflow-hidden">
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=600"; // Fallback image if 404 occurs
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 badge badge-success py-4 px-4 gap-2 text-white font-bold border-none shadow-lg">
                  <FaCheckCircle className="text-sm" /> Resolved
                </div>
              </div>

              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-3">
                   <FaLayerGroup /> {issue.category}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-4 line-clamp-2 leading-tight group-hover:text-success transition-colors">
                  {issue.title}
                </h3>

                <p className="flex items-center gap-2 text-slate-500 font-medium mb-8">
                  <FaMapMarkerAlt className="text-red-400" />
                  {issue.location}
                </p>

                
                <div className="mt-auto border-t border-gray-50 pt-6">
                  <Link
                    to={`/issue/${issue._id}`}
                    className="flex items-center justify-between w-full text-slate-900 font-black group/btn"
                  >
                    <span className="text-sm tracking-tighter uppercase">View Full Details</span>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover/btn:bg-success group-hover/btn:text-white transition-all">
                      <FaExternalLinkAlt className="text-xs" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

       
        {issues.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[40px] shadow-inner border-2 border-dashed border-gray-200">
            <p className="text-2xl text-gray-400 font-semibold italic">
              No recent issues have been resolved yet. Be the first to report!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestResolvedIssues;