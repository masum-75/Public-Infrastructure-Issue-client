import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router"; 
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
import { FaGoogle } from "react-icons/fa";

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    
    const { createUser, updateUserProfile, googleSignIn } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            let photoURL = "https://i.ibb.co/mR7093X/user.png"; 

            if (data.image && data.image[0]) {
                const formData = new FormData();
                formData.append("image", data.image[0]);
                
                const imgRes = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
                    formData
                );
                
                if (imgRes.data.success) {
                    photoURL = imgRes.data.data.url;
                }
            }

         
            await createUser(data.email, data.password);
            
         
            await updateUserProfile(data.name, photoURL);

            
            const userInfo = {
                name: data.name,
                email: data.email,
                photoURL,
                role: "citizen",
                createdAt: new Date(),
            };

            const dbRes = await axios.post(
                `${import.meta.env.VITE_API_URL}/users`,
                userInfo
            );

            if (dbRes.data.insertedId || dbRes.data.message === "user already exists") {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Account created successfully!",
                    timer: 2000,
                    showConfirmButton: false
                });
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
            });
        }
    };

    const handleGoogleLogin = () => {
        googleSignIn()
            .then(() => {
                navigate("/");
            })
            .catch((err) => {
                Swal.fire("Error", err.message, "error");
            });
    };

    return (
        <div className="hero min-h-screen bg-base-200 p-4">
            <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">
                <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            {...register("name", { required: "Name is required" })}
                            className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                        />
                        {errors.name && <span className="text-error text-sm">{errors.name.message}</span>}
                    </div>

                    
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            {...register("email", { required: "Email is required" })}
                            className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                        />
                        {errors.email && <span className="text-error text-sm">{errors.email.message}</span>}
                    </div>

                 
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register("password", { 
                                required: "Password is required", 
                                minLength: { value: 6, message: "Minimum 6 characters" } 
                            })}
                            className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                        />
                        {errors.password && <span className="text-error text-sm">{errors.password.message}</span>}
                    </div>

                    
                    <div>
                        <label className="label">
                            <span className="label-text">Profile Picture (Optional)</span>
                        </label>
                        <input
                            type="file"
                            {...register("image")}
                            className="file-input file-input-bordered w-full"
                        />
                    </div>

                    <button className="btn btn-primary w-full text-white">Register</button>
                </form>

                <div className="divider">OR</div>

                <button
                    onClick={handleGoogleLogin}
                    className="btn btn-outline w-full flex gap-2"
                >
                    <FaGoogle /> Sign in with Google
                </button>

                <p className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary font-bold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;