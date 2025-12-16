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
      
      const formData = new FormData();
      formData.append("image", data.image[0]);
      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_host_key
        }`,
        formData
      );
      const photoURL = imgRes.data.data.url;

      
      const result = await createUser(data.email, data.password);
      await updateUserProfile({ displayName: data.name, photoURL });

     
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
      if (dbRes.data.insertedId) {
        Swal.fire("Success", "Account created successfully!", "success");
        navigate("/");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleGoogleLogin = () => {
    googleSignIn()
      .then(() => navigate("/"))
      .catch((err) => Swal.fire("Error", err.message, "error"));
  };

  return (
    <div className="hero min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            {...register("name", { required: true })}
            className="input input-bordered w-full"
          />
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="input input-bordered w-full"
          />
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true, minLength: 6 })}
            className="input input-bordered w-full"
          />
          <input
            type="file"
            {...register("image", { required: true })}
            className="file-input file-input-bordered w-full"
          />
          <button className="btn btn-primary w-full">Register</button>
        </form>
        <div className="divider">OR</div>
        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full flex gap-2"
        >
          <FaGoogle /> Sign in with Google
        </button>
        <p className="mt-4 text-center">
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
