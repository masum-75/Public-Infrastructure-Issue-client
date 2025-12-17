import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaUserPlus, FaUserTie, FaEdit, FaTrash } from "react-icons/fa";
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
    mutationFn: (email) => {
      return axiosSecure.delete(`/dashboard/admin/staff/${email}`);
    },
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
      text: `Are you sure you want to delete staff member ${staff.displayName}? This action is permanent.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteStaffMutation.mutate(staff.email);
      }
    });
  };

  if (isLoading) {
    return (
      <span className="loading loading-infinity loading-xl block mx-auto mt-20"></span>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold mb-6 text-secondary">
        Manage Staff Members ({staffList.length})
      </h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary mb-6 text-black flex items-center"
      >
        <FaUserPlus /> Add New Staff
      </button>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff, index) => (
              <tr key={staff._id}>
                <th>{index + 1}</th>
                <td>
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src={staff.photoURL} alt="Staff Avatar" />
                    </div>
                  </div>
                </td>
                <td>{staff.displayName}</td>
                <td>{staff.email}</td>
                <td>
                  <span className="badge badge-lg badge-info text-white">
                    {staff.role}
                  </span>
                </td>
                <td className="space-x-2">
                  <button
                    className="btn btn-sm btn-warning tooltip"
                    data-tip="Edit Staff"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(staff)}
                    className="btn btn-sm btn-error text-white tooltip"
                    data-tip="Delete Staff"
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
