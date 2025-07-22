// src/pages/Signin.js
import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      if (res.data.success) {
        login(res.data.token); // Save token
        navigate('/'); // Redirect
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      alert("Login failed");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">Sign in to continue your athletic journey</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full outline-none text-sm text-gray-700 bg-transparent"
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full outline-none text-sm text-gray-700 bg-transparent"
            />
          </div>
        </div>

        <div className="text-right text-sm text-blue-500 mb-4 hover:underline cursor-pointer">Forgot password?</div>

        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2.5 rounded-md font-semibold shadow-md hover:opacity-90 transition mb-4">
          Sign In
        </button>

        <p className="text-center text-sm text-gray-600 mb-6">
          Don’t have an account?{' '}
          <NavLink to="/signup" className="text-blue-600 font-medium hover:underline cursor-pointer">
            Sign up
          </NavLink>
        </p>

        <div className="bg-gray-100 text-center text-sm text-gray-700 px-4 py-3 rounded-md mb-4">
          <p className="mb-1">Try these demo credentials:</p>
          <code className="block text-blue-600 font-mono text-sm">Email: demo@athletex.com</code>
          <code className="block text-blue-600 font-mono text-sm">Password: demo123</code>
        </div>
      </form>
    </div>
  );
}

export default Signin;
