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
            const res = await axiosSecure.get('/users/all');
            return res.data;
        }
    });

   
    const blockMutation = useMutation({
        mutationFn: ({ id, isBlocked }) => {
           
            return axiosSecure.patch(`/users/${id}/block`, { isBlocked });
        },
        onSuccess: (res, variables) => {
            if (res.data.modifiedCount > 0) {
                const action = variables.isBlocked ? 'Blocked' : 'Unblocked';
                Swal.fire('Success!', `User successfully ${action}.`, 'success');
                queryClient.invalidateQueries({ queryKey: ['allUsersAdmin'] });
                queryClient.invalidateQueries({ queryKey: ['user-status'] }); // To update UI instantly if admin blocks own role
            }
        },
        onError: (error) => {
            Swal.fire('Error', 'Failed to update user status.', 'error');
        }
    });

    const handleBlockToggle = (user) => {
        const isBlocked = !user.isBlocked;
        const action = isBlocked ? 'block' : 'unblock';

        Swal.fire({
            title: `Confirm ${action.toUpperCase()}?`,
            text: `Do you want to ${action} ${user.displayName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isBlocked ? '#d33' : '#3085d6',
            cancelButtonColor: '#aaa',
            confirmButtonText: `Yes, ${action} them!`
        }).then((result) => {
            if (result.isConfirmed) {
                blockMutation.mutate({ id: user._id, isBlocked });
            }
        });
    };

    if (isLoading) {
        return <span className="loading loading-infinity loading-xl block mx-auto mt-20"></span>;
    }

    return (
        <div className='p-4'>
            <h2 className="text-4xl font-bold mb-6 text-secondary">Manage Citizens & Users ({users.length})</h2>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Premium</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <th>{index + 1}</th>
                                <td>{user.displayName}</td>
                                <td>{user.email}</td>
                                <td><span className="badge badge-lg capitalize">{user.role}</span></td>
                                <td>
                                    {user.isPremium ? <FaCrown className='text-yellow-500 text-xl' title="Premium User" /> : 'No'}
                                </td>
                                <td>
                                    <span className={`badge badge-lg ${user.isBlocked ? 'badge-error' : 'badge-success'} text-white`}>
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleBlockToggle(user)}
                                        className={`btn btn-sm ${user.isBlocked ? 'btn-success' : 'btn-error'} text-white tooltip`}
                                        data-tip={user.isBlocked ? 'Unblock User' : 'Block User'}
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