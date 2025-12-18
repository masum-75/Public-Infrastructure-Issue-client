import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import axios from 'axios';

const categories = ['Pothole', 'Streetlight', 'Water Leakage', 'Garbage Overflow', 'Damaged Footpath'];

const EditIssueModal = ({ issue, onClose, refetch }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: issue
    });
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const editMutation = useMutation({
        mutationFn: ({ id, updatedData }) => {
            return axiosSecure.patch(`/dashboard/my-issues/${id}`, updatedData);
        },
        onSuccess: () => {
            Swal.fire('Updated!', 'Issue details updated successfully.', 'success');
            queryClient.invalidateQueries({ queryKey: ['myIssues'] }); 
            queryClient.invalidateQueries({ queryKey: ['issues', issue._id] }); 
            refetch(); 
            onClose();
        },
        onError: () => {
            Swal.fire('Error', 'Failed to update issue. Only Pending issues can be modified.', 'error');
        }
    });

    const handleFormSubmit = async (data) => {
        let imageUrl = issue.imageUrl; 

        const imageFile = data.image[0];
        if (imageFile) {
            // 1. Upload new image if provided
            const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
            const formData = new FormData();
            formData.append('image', imageFile);

            try {
                const imgRes = await axios.post(image_API_URL, formData);
                imageUrl = imgRes.data.data.url;
            } catch (error) {
                Swal.fire('Error', 'New image upload failed. Using old photo.', 'warning');
            }
        }

        const updatedData = {
            title: data.title,
            description: data.description,
            category: data.category,
            location: data.location,
            imageUrl: imageUrl,
        };

        editMutation.mutate({ id: issue._id, updatedData });
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-lg">
                <h3 className="font-bold text-2xl mb-4 text-warning">Edit Pending Issue</h3>
                <p className='mb-4 text-sm'>Only **Title, Description, Category, Location,** and **Photo** can be edited when the status is **Pending**.</p>
                
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    
                    {/* Title */}
                    <label className="form-control w-full">
                        <span className="label-text">Issue Title</span>
                        <input type="text" {...register('title', { required: true, minLength: 5 })} className="input input-bordered w-full" />
                    </label>

                    {/* Description */}
                    <label className="form-control w-full">
                        <span className="label-text">Description</span>
                        <textarea {...register('description', { required: true, minLength: 20 })} className="textarea textarea-bordered h-24"></textarea>
                    </label>

                    {/* Category */}
                    <label className="form-control w-full">
                        <span className="label-text">Category</span>
                        <select {...register('category', { required: true })} className="select select-bordered">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </label>

                    {/* Location */}
                    <label className="form-control w-full">
                        <span className="label-text">Location</span>
                        <input type="text" {...register('location', { required: true })} className="input input-bordered w-full" />
                    </label>

                    {/* Image Upload */}
                    <label className="form-control w-full">
                        <span className="label-text">New Photo (Optional, leave blank to keep old)</span>
                        <input type="file" {...register('image')} accept="image/*" className="file-input file-input-bordered w-full" />
                    </label>

                    <div className="modal-action">
                        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={editMutation.isPending}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-warning text-black" disabled={editMutation.isPending}>
                            {editMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditIssueModal;