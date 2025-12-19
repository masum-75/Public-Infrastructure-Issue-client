import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaUserCheck, FaUserSlash, FaCrown } from 'react-icons/fa';

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

    const blockMutation = useMutation({
        mutationFn: ({ id, isBlocked }) => axiosSecure.patch(`/users/${id}/block`, { isBlocked }),
        onSuccess: (res, variables) => {
            if (res.data.modifiedCount > 0) {
                const action = variables.isBlocked ? 'Blocked' : 'Unblocked';
                Swal.fire('Success!', `User successfully ${action}.`, 'success');
                queryClient.invalidateQueries({ queryKey: ['allUsersAdmin'] });
            }
        },
        onError: () => Swal.fire('Error', 'Failed to update user status.', 'error')
    });

    const handleBlockToggle = (user) => {
        const isBlocked = !user.isBlocked;
        Swal.fire({
            title: `Confirm ${isBlocked ? 'BLOCK' : 'UNBLOCK'}?`,
            text: `Do you want to change status for ${user.displayName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isBlocked ? '#d33' : '#3085d6',
            confirmButtonText: 'Yes, Confirm!'
        }).then((result) => {
            if (result.isConfirmed) blockMutation.mutate({ id: user._id, isBlocked });
        });
    };

    if (isLoading) return <div className="flex justify-center mt-20"><span className="loading loading-infinity loading-lg text-primary"></span></div>;

    return (
        <div className='p-6 bg-white rounded-xl shadow-sm'>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Manage Citizens <span className="text-primary">({users.length})</span></h2>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="table w-full">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="py-4">#</th>
                            <th>User Info</th>
                            <th>Role</th>
                            <th>Premium</th>
                            <th>Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user, index) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                <th className="text-gray-400 font-medium">{index + 1}</th>
                                <td>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-700">{user.displayName || 'Anonymous'}</span>
                                        <span className="text-xs text-gray-400">{user.email}</span>
                                    </div>
                                </td>
                                <td><span className="badge badge-ghost badge-md capitalize font-semibold">{user.role}</span></td>
                                <td className="text-center">
                                    {user.isPremium ? <FaCrown className='text-yellow-500 text-xl' /> : <span className="text-gray-300">-</span>}
                                </td>
                                <td>
                                    <span className={`badge ${user.isBlocked ? 'badge-error' : 'badge-success'} text-white font-bold px-4 py-3`}>
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <button
                                        onClick={() => handleBlockToggle(user)}
                                        className={`btn btn-circle btn-sm ${user.isBlocked ? 'btn-success' : 'btn-error'} text-white shadow-sm`}
                                        disabled={blockMutation.isPending}
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