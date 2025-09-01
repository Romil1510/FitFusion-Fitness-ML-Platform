// src/pages/CoachSignup.jsx

import React, { useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useNavigate, Navigate, NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";

const CoachSignup = () => {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/coach/signup",
        { name, email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(res.data.message || "Coach signup successful");
      login(res.data.coach); // login from context
      setName("");
      setEmail("");
      setPassword("");
      navigate("/coach/dashboard"); // redirect to coach dashboard
    } catch (error) {
      const msg = error?.response?.data?.message || "Signup failed";
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
          Coach Signup
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Create your account and manage your athletes
        </p>

        {/* Signup Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                value={name}
                placeholder="Coach Ramesh"
                onChange={(e) => setName(e.target.value)}
                className="w-full outline-none text-sm text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                value={email}
                placeholder="coach@email.com"
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
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
            Sign Up as Coach
          </button>
        </form>

        {/* Link to login */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already a coach?{" "}
          <NavLink
            to="/coach/login"
            className="text-indigo-600 font-medium hover:underline cursor-pointer"
          >
            Sign In
          </NavLink>
        </p>

        {/* Info box */}
        <div className="bg-indigo-50 text-center text-sm text-gray-700 px-4 py-3 rounded-md mt-6">
          <p className="mb-1">After signup, share your coach code with athletes:</p>
          <span className="text-indigo-600 font-semibold">Found in your profile</span>
        </div>
      </div>
    </div>
  );
};

export default CoachSignup;
