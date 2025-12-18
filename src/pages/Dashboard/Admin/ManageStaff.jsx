import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import AddStaffModal from "./AddStaffModal";

const ManageStaff = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: staffList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["staffListAdmin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/staff");
      return res.data;
    },
  });

  const deleteStaffMutation = useMutation({
    mutationFn: (email) =>
      axiosSecure.delete(`/dashboard/admin/staff/${email}`),
    onSuccess: () => {
      Swal.fire("Deleted!", "Staff account removed successfully.", "success");
      queryClient.invalidateQueries({ queryKey: ["staffListAdmin"] });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete staff account.";
      Swal.fire("Error", message, "error");
    },
  });

  const handleDeleteStaff = (staff) => {
    Swal.fire({
      title: "Confirm Delete?",
      text: `Are you sure you want to delete ${staff.displayName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete!",
    }).then((result) => {
      if (result.isConfirmed) deleteStaffMutation.mutate(staff.email);
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-infinity loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Manage Staff Members{" "}
          <span className="text-primary">({staffList.length})</span>
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary shadow-md hover:scale-105 transition-transform text-white border-none bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          <FaUserPlus className="mr-2" /> Add New Staff
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="table w-full">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="py-4">#</th>
              <th>Profile</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Role Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {staffList.map((staff, index) => (
              <tr
                key={staff._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <th className="text-gray-400 font-medium">{index + 1}</th>
                <td>
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12 shadow-sm border border-gray-100">
                      <img
                        src={
                          staff.photoURL || "https://via.placeholder.com/150"
                        }
                        alt="Avatar"
                      />
                    </div>
                  </div>
                </td>
                <td className="font-bold text-gray-700">{staff.displayName}</td>
                <td className="text-gray-500">{staff.email}</td>
                <td>
                  <span className="badge badge-info text-white font-bold px-4 py-3 border-none">
                    {staff.role}
                  </span>
                </td>
                <td className="flex justify-center gap-3">
                  <button className="btn btn-square btn-sm btn-warning text-white">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(staff)}
                    className="btn btn-square btn-sm btn-error text-white"
                    disabled={deleteStaffMutation.isPending}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AddStaffModal
          onClose={() => setIsModalOpen(false)}
          refetchStaff={refetch}
        />
      )}
    </div>
  );
};

export default ManageStaff;
