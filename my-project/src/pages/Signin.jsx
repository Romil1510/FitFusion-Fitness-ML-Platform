// src/pages/Signin.jsx
import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../components/AuthContext";

const Signin = () => {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      toast.success("Login successful");
      login(res.data.user); // update context
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  if (isLoggedIn) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Sign in to continue your athletic journey
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                value={email}
                placeholder="your@email.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none text-sm text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none text-sm text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          <div className="text-right text-sm text-blue-500 mb-4 hover:underline cursor-pointer">
            Forgot password?
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2.5 rounded-md font-semibold shadow-md hover:opacity-90 transition mb-4"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-600 mb-6">
            Don’t have an account?{" "}
            <NavLink to="/signup" className="text-blue-600 font-medium hover:underline cursor-pointer">
              Sign up
            </NavLink>
          </p>
        </form>

        {/* Demo Credentials Box */}
        <div className="bg-gray-100 text-center text-sm text-gray-700 px-4 py-3 rounded-md mb-4">
          <p className="mb-1">Try these demo credentials:</p>
          <code className="block text-blue-600 font-mono text-sm">
            Email: demo@athletex.com
          </code>
          <code className="block text-blue-600 font-mono text-sm">
            Password: demo123
          </code>
        </div>
      </div>
    </div>
  );
};

export default Signin;
