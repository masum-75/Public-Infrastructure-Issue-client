import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FaUserPlus } from 'react-icons/fa';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const handleRegistration = async (data) => {
        let photoURL = 'https://via.placeholder.com/150'; 
        const imageFile = data.image[0];

        
        if (imageFile) {
            // const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
            const formData = new FormData();
            formData.append('image', imageFile);

            try {
                const imgRes = await axios.post( formData);
                photoURL = imgRes.data.data.url;
            } catch (error) {
                Swal.fire('Warning', 'Image upload failed. Proceeding with a default photo.', 'warning');
            }
        }

        try {
            
            const result = await createUser(data.email, data.password);
            const user = result.user;

         
            await updateUserProfile({ displayName: data.name, photoURL });

           
            const userInfo = {
                email: data.email,
                displayName: data.name,
                photoURL: photoURL,
                role: 'citizen',
                isPremium: false,
                isBlocked: false,
                createdAt: new Date(),
            };
            const dbRes = await axiosSecure.post('/users', userInfo);
            
            if (dbRes.data.insertedId) {
                Swal.fire('Success', 'Registration successful! Welcome to the platform.', 'success');
                navigate('/dashboard/home'); 
            }

        } catch (error) {
           
            let errorMessage = 'Registration failed. Please check your details.';
            if (error.code === 'auth/email-already-in-use') {
                 errorMessage = 'This email is already registered.';
            }
            Swal.fire('Error', errorMessage, 'error');
        }
    };

    return (
        <div className="min-h-screen hero bg-base-200">
            <div className="flex-col hero-content lg:flex-row-reverse">
                 <div className="text-center lg:text-left lg:w-1/2">
                    <h1 className="text-5xl font-bold text-primary">Join the Movement!</h1>
                    <p className="py-6">Report infrastructure issues quickly, track progress, and help build a better community. Register now to get started.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 lg:w-1/2">
                    <form onSubmit={handleSubmit(handleRegistration)} className="card-body">
                        <h2 className='text-3xl font-bold text-secondary flex items-center'><FaUserPlus className='mr-2'/> Register</h2>
                        
                        {/* Name */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Full Name</span></label>
                            <input type="text" placeholder="Your Name" {...register('name', { required: true })} className="input input-bordered" />
                            {errors.name && <span className='text-red-500 text-sm mt-1'>Name is required</span>}
                        </div>
                        
                        {/* Email */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <input type="email" placeholder="email" {...register('email', { required: true })} className="input input-bordered" />
                            {errors.email && <span className='text-red-500 text-sm mt-1'>Email is required</span>}
                        </div>
                        
                        {/* Password */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input type="password" placeholder="password" {...register('password', { required: true, minLength: 6 })} className="input input-bordered" />
                            {errors.password && <span className='text-red-500 text-sm mt-1'>Password must be at least 6 characters</span>}
                        </div>
                        
                        {/* Photo Upload */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Profile Photo (Optional)</span></label>
                            <input type="file" {...register('image')} accept="image/*" className="file-input file-input-bordered file-input-sm w-full" />
                        </div>
                        
                        <div className="mt-6 form-control">
                            <button type="submit" className="btn btn-primary text-black">Register</button>
                        </div>
                        
                        <p className='mt-4 text-center text-sm'>
                            Already have an account? <Link to="/login" className="link link-hover text-secondary">Login here</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;