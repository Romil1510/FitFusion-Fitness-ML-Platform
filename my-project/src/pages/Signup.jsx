// src/pages/Signup.jsx

import React, { useState } from "react";
import { FaEnvelope, FaLock, FaUserTag } from "react-icons/fa"; // Added FaUserTag for coach code icon
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../components/AuthContext.jsx";

const Signup = () => {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [coachCode, setCoachCode] = useState(""); // NEW STATE

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password, coachCode }, // Include coachCode in request
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(res.data.message || "Signup successful");
      login(res.data.user);
      setName("");
      setEmail("");
      setPassword("");
      setCoachCode("");
      navigate("/");
    } catch (error) {
      const msg = error?.response?.data?.message || "Signup failed";
      toast.error(msg);
    }
  };

  if (isLoggedIn) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <span className="text-3xl">🏋️</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
          Join FitFusion
        </h2>
        <p className="text-center text-gray-600 mb-6">Start Your Journey Today</p>

        {/* Signup Form */}
        <form onSubmit={handleRegister}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="text"
                value={name}
                placeholder="Rohan Patel"
                onChange={(e) => setName(e.target.value)}
                className="w-full outline-none text-sm text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="mb-4">
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

          {/* Coach Code (Optional) */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coach Code (optional)
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <FaUserTag className="text-gray-400 mr-2" />
              <input
                type="text"
                value={coachCode}
                placeholder="Enter Coach Code"
                onChange={(e) => setCoachCode(e.target.value)}
                className="w-full outline-none text-sm text-gray-700 bg-transparent"
              />
            </div>
          </div>

          {/* Forgot */}
          <div className="text-right text-sm text-blue-500 mb-4 hover:underline cursor-pointer">
            Forgot password?
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2.5 rounded-md font-semibold shadow-md hover:opacity-90 transition mb-4"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600 mb-6">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="text-blue-600 font-medium hover:underline cursor-pointer"
            >
              Sign In
            </NavLink>
          </p>
        </form>

        {/* Demo */}
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

export default Signup;
