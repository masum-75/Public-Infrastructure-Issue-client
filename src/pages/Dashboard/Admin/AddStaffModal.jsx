import React from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddStaffModal = ({ onClose, refetchStaff }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const axiosSecure = useAxiosSecure();

    
    const addStaffMutation = useMutation({
        mutationFn: (staffData) => {
            return axiosSecure.post('/dashboard/admin/staff', staffData);
        },
        onSuccess: () => {
            Swal.fire('Success!', 'New staff member added successfully.', 'success');
            refetchStaff();
            onClose();
        },
        onError: (error) => {
            let message = 'Failed to add staff.';
            if (error.response?.status === 409) {
                 message = error.response.data.message;
            }
            Swal.fire('Error', message, 'error');
        }
    });

    const handleFormSubmit = async (data) => {
        let photoURL = 'https://via.placeholder.com/150'; 
        const imageFile = data.image[0];

        if (imageFile) {
           
            const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
            const formData = new FormData();
            formData.append('image', imageFile);

            try {
                const imgRes = await axios.post(image_API_URL, formData);
                photoURL = imgRes.data.data.url;
            } catch (error) {
                Swal.fire('Error', 'Image upload failed. Submitting with default photo.', 'warning');
            }
        }
        
        
        const staffData = {
            email: data.email,
            password: data.password,
            displayName: data.name,
            phone: data.phone,
            photoURL: photoURL
        };

        addStaffMutation.mutate(staffData);
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Add New Staff Account</h3>
                <p className="py-2">Staff accounts are created in both the database and Firebase Auth.</p>
                
                <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4 mt-4'>
                    
                    {/* Name */}
                    <input type="text" {...register('name', { required: true })} placeholder="Full Name" className="input input-bordered w-full" />
                    {errors.name && <span className='text-red-500 text-sm'>Name is required</span>}

                    {/* Email */}
                    <input type="email" {...register('email', { required: true })} placeholder="Email" className="input input-bordered w-full" />
                    {errors.email && <span className='text-red-500 text-sm'>Email is required</span>}

                    {/* Password */}
                    <input type="password" {...register('password', { required: true, minLength: 6 })} placeholder="Password (min 6 chars)" className="input input-bordered w-full" />
                    {errors.password && <span className='text-red-500 text-sm'>Password is required and must be 6 characters long</span>}
                    
                    {/* Phone */}
                    <input type="text" {...register('phone')} placeholder="Phone Number" className="input input-bordered w-full" />

                    {/* Photo */}
                    <label className="form-control w-full">
                        <span className="label-text text-sm">Staff Photo (Optional)</span>
                        <input type="file" {...register('image')} accept="image/*" className="file-input file-input-bordered w-full" />
                    </label>

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose} disabled={addStaffMutation.isPending}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary text-black" disabled={addStaffMutation.isPending}>
                            {addStaffMutation.isPending ? 'Creating...' : 'Create Staff Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaffModal;