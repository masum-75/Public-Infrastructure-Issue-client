import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { signIn, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then(() => {
        Swal.fire("Success", "Welcome back!", "success");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const message =
          error.code === "auth/invalid-credential"
            ? "Invalid Email or Password"
            : error.message;
        Swal.fire("Error", message, "error");
      });
  };

  const handleGoogleLogin = () => {
    googleSignIn()
      .then(() => navigate(from, { replace: true }))
      .catch((err) => Swal.fire("Error", err.message, "error"));
  };

  return (
    <div className="hero min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Login Now</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="input input-bordered w-full"
          />
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="input input-bordered w-full"
          />
          <button className="btn btn-primary w-full">Login</button>
        </form>
        <div className="divider">OR</div>
        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full flex gap-2"
        >
          <FaGoogle /> Google Login
        </button>
        <p className="mt-4 text-center">
          New here?{" "}
          <Link to="/register" className="text-primary font-bold">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
