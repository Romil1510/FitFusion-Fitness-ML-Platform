// src/pages/Signin.jsx
import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaRunning } from "react-icons/fa";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../components/AuthContext";

const Signin = () => {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        {/* Logo/Header Section */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-full">
            <FaRunning className="text-white text-2xl" />
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Sign in to continue your athletic journey
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                value={email}
                placeholder="your@email.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400"
                required
              />
              <button 
                type="button" 
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="text-right text-sm text-blue-500 mb-6 hover:underline cursor-pointer transition-colors duration-200 hover:text-blue-700">
            Forgot password?
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 mb-6 flex items-center justify-center ${
              isLoading ? "opacity-75 cursor-not-allowed" : "hover:opacity-95"
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="text-center text-sm text-gray-600 mb-8">
            Don't have an account?{" "}
            <NavLink 
              to="/signup" 
              className="text-blue-600 font-medium hover:underline cursor-pointer transition-colors duration-200 hover:text-blue-800"
            >
              Sign up
            </NavLink>
          </p>
        </form>

        {/* Demo Credentials Box */}
        <div className="bg-blue-50 border border-blue-100 text-center text-sm text-gray-700 px-4 py-4 rounded-lg mb-4">
          <p className="font-medium text-blue-700 mb-2">Try these demo credentials:</p>
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <span className="text-blue-600 font-mono text-sm bg-blue-100 px-2 py-1 rounded">demo@athletex.com</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-blue-600 font-mono text-sm bg-blue-100 px-2 py-1 rounded">demo123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;