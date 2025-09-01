// src/pages/CoachLogin.jsx
import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate, Navigate, NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useCoachAuth } from "../CoachAuthContext";

const CoachLogin = () => {
  const { isLoggedIn, login } = useCoachAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/coach/login", 
        form, 
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      login(res.data.coach);
      toast.success("Login successful!");
      navigate("/coach/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      toast.error(msg);
    }
  };

  if (isLoggedIn) return <Navigate to="/coach/dashboard" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Logo / Icon */}
        <div className="flex justify-center mb-3">
          <span className="text-4xl">🏆</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
          Coach Login
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Access your coaching dashboard
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="coach@email.com"
                onChange={handleChange}
                className="w-full outline-none text-sm text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                value={form.password}
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full outline-none text-sm text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2.5 rounded-md font-semibold shadow-md hover:opacity-90 transition"
          >
            Login as Coach
          </button>
        </form>

        {/* Link to signup */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <NavLink
            to="/coach/signup"
            className="text-indigo-600 font-medium hover:underline cursor-pointer"
          >
            Sign Up
          </NavLink>
        </p>

        {/* Info box */}
        <div className="bg-indigo-50 text-center text-sm text-gray-700 px-4 py-3 rounded-md mt-6">
          <p>Need help accessing your account?</p>
          <span className="text-indigo-600 font-semibold">Contact support</span>
        </div>
      </div>
    </div>
  );
};

export default CoachLogin;