import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaUserCheck, FaUserSlash, FaCrown, FaUserShield } from 'react-icons/fa';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

   
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['allUsersAdmin'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

   
    const roleMutation = useMutation({
        mutationFn: ({ id, role }) => axiosSecure.patch(`/users/role/${id}`, { role }),
        onSuccess: (res) => {
            if (res.data.modifiedCount > 0) {
                Swal.fire('Success!', 'User role updated successfully.', 'success');
                queryClient.invalidateQueries({ queryKey: ['allUsersAdmin'] });
            }
        },
        onError: () => Swal.fire('Error', 'Failed to update role.', 'error')
    });

    
    const blockMutation = useMutation({
        mutationFn: ({ id, isBlocked }) => axiosSecure.patch(`/users/${id}/block`, { isBlocked }),
        onSuccess: (res, variables) => {
            if (res.data.modifiedCount > 0) {
                const action = variables.isBlocked ? 'Blocked' : 'Unblocked';
                Swal.fire('Success!', `User successfully ${action}.`, 'success');
                queryClient.invalidateQueries({ queryKey: ['allUsersAdmin'] });
            }
        }
    });

    const handleRoleChange = (user, newRole) => {
        Swal.fire({
            title: `Make ${newRole.toUpperCase()}?`,
            text: `Change ${user.displayName}'s role to ${newRole}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Change it!'
        }).then((result) => {
            if (result.isConfirmed) roleMutation.mutate({ id: user._id, role: newRole });
        });
    };

    if (isLoading) return <div className="flex justify-center mt-20"><span className="loading loading-infinity loading-lg text-primary"></span></div>;

    return (
        <div className='p-6 bg-white rounded-xl shadow-sm'>
            <h2 className="text-3xl font-extrabold mb-8 text-gray-800">Manage Citizens <span className="text-primary">({users.length})</span></h2>
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="table w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th>#</th>
                            <th>User Info</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <th>{index + 1}</th>
                                <td>
                                    <div className="font-bold">{user.displayName}</div>
                                    <div className="text-xs text-gray-400">{user.email}</div>
                                </td>
                                <td>
                                    <span className={`badge badge-md capitalize ${user.role === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${user.isBlocked ? 'badge-error' : 'badge-success'} text-white`}>
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td className="text-center flex justify-center gap-2">
                                    
                                    {user.role === 'citizen' && (
                                        <button 
                                            onClick={() => handleRoleChange(user, 'staff')}
                                            className="btn btn-sm btn-outline btn-info"
                                            title="Promote to Staff"
                                        >
                                            <FaUserShield /> Staff
                                        </button>
                                    )}

                                    {/* Block Toggle Button */}
                                    <button
                                        onClick={() => blockMutation.mutate({ id: user._id, isBlocked: !user.isBlocked })}
                                        className={`btn btn-sm ${user.isBlocked ? 'btn-success' : 'btn-error'} text-white`}
                                    >
                                        {user.isBlocked ? <FaUserCheck /> : <FaUserSlash />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;