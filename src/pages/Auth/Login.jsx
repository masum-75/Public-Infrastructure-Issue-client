import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import { FaSignInAlt } from 'react-icons/fa';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    
    const from = location.state?.from?.pathname || "/dashboard/home";

    const handleLogin = async (data) => {
        try {
            const result = await signIn(data.email, data.password);
            
            if (result.user) {
                Swal.fire('Success', 'Login successful! Redirecting to dashboard.', 'success');
                navigate(from, { replace: true });
            }
        } catch (error) {
            let errorMessage = 'Login failed. Check email and password.';
            if (error.code === 'auth/invalid-credential') {
                 errorMessage = 'Invalid email or password.';
            }
            Swal.fire('Error', errorMessage, 'error');
        }
    };

    return (
        <div className="min-h-screen hero bg-base-200">
            <div className="flex-col hero-content lg:flex-row">
                <div className="text-center lg:text-left lg:w-1/2">
                    <h1 className="text-5xl font-bold text-primary">Welcome Back!</h1>
                    <p className="py-6">Log in to track your reported issues and check community updates.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 lg:w-1/2">
                    <form onSubmit={handleSubmit(handleLogin)} className="card-body">
                        <h2 className='text-3xl font-bold text-secondary flex items-center'><FaSignInAlt className='mr-2'/> Login</h2>

                        {/* Email */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <input type="email" placeholder="email" {...register('email', { required: true })} className="input input-bordered" />
                            {errors.email && <span className='text-red-500 text-sm mt-1'>Email is required</span>}
                        </div>
                        
                        {/* Password */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input type="password" placeholder="password" {...register('password', { required: true })} className="input input-bordered" />
                            {errors.password && <span className='text-red-500 text-sm mt-1'>Password is required</span>}
                        </div>

                        <div className="mt-6 form-control">
                            <button type="submit" className="btn btn-primary text-black">Login</button>
                        </div>
                        
                        <p className='mt-4 text-center text-sm'>
                            Don't have an account? <Link to="/register" className="link link-hover text-secondary">Register here</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;