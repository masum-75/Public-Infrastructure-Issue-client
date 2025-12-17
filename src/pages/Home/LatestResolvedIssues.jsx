import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
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
      <p className="text-center my-10">
        <span className="loading loading-spinner loading-lg"></span> Loading...
      </p>
    );
  }

  return (
    <section className="py-20">
      <h2 className="text-4xl font-bold text-center mb-4 text-primary">
        Latest Resolved Issues
      </h2>
      <p className="text-center text-gray-600 mb-12">
        See the recent successful resolutions driven by our community.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {issues.map((issue) => (
          <div
            key={issue._id}
            className="card bg-base-100 shadow-xl border-t-4 border-success/70"
          >
            <figure>
              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body p-5">
              <div className="flex justify-between items-center mb-2">
                <div className="badge badge-success text-white font-bold">
                  <FaCheckCircle className="mr-1" /> Resolved
                </div>
                <span className="text-sm text-gray-500">{issue.category}</span>
              </div>
              <h3 className="card-title text-xl mb-2 line-clamp-2">
                {issue.title}
              </h3>
              <p className="flex items-center text-sm text-gray-700">
                <FaMapMarkerAlt className="mr-1 text-primary" />{" "}
                {issue.location}
              </p>

              <div className="card-actions justify-end mt-4">
                <Link
                  to={`/issue/${issue._id}`}
                  className="btn btn-sm btn-info text-white"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {issues.length === 0 && (
        <p className="text-center text-gray-500">
          No recent issues have been resolved yet.
        </p>
      )}
    </section>
  );
};

export default LatestResolvedIssues;
