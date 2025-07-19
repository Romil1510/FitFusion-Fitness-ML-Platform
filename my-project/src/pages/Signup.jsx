import React, { use, useContext, useState } from "react";
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { NavLink, useNavigate } from "react-router";
const Signup=()=>{


    const[name,Setname]=useState("")
    const[email,Setemail]=useState("")
    const[password,Setpassword]=useState("")

    const navigateTo = useNavigate();

const handleRegister=async(e)=>{
    e.preventDefault();
    try {
        await axios.post("http://localhost:5000/api/auth/signup",{name,email,password},{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        }).then((res)=>{
            toast.success(res.data.message)
            navigateTo("/")
            Setname("")
            Setpassword("")
            Setemail("")
        });
    } catch (error) {
        
    }
}

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4 top-0">
             
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        {/* Heading */}
        <div className="flex justify-center item-center">
        <span>🏋️</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
          Join FitFusion
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Start Your Journey Today 
        </p>

        {/* Email */}
        <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="username"
              value={name}
              placeholder="Rohan Patel"
              onChange={(e)=>Setname(e.target.value)}
              className="w-full outline-none text-sm text-gray-700 bg-transparent"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              value={email}
              placeholder="your@email.com"
              onChange={(e)=>Setemail(e.target.value)}
              className="w-full outline-none text-sm text-gray-700 bg-transparent"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e)=>Setpassword(e.target.value)}
              className="w-full outline-none text-sm text-gray-700 bg-transparent"
            />
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right text-sm text-blue-500 mb-4 hover:underline cursor-pointer">
          Forgot password?
        </div>

        {/* Sign In Button */}
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2.5 rounded-md font-semibold shadow-md hover:opacity-90 transition mb-4">
          Sign Up
        </button>

        {/* Sign In Link */}
        <p className="text-center text-sm text-gray-600 mb-6">
          Don’t have an account?{' '}
          <NavLink to="/login" className="text-blue-600 font-medium hover:underline cursor-pointer">
            Sign In
          </NavLink>
        </p>
        </form>

        {/* Divider */}
        {/* <div className="flex items-center justify-center text-gray-400 text-xs uppercase mb-4">
          <span className="w-full border-t border-gray-200 mr-2"></span>
          Demo Credentials
          <span className="w-full border-t border-gray-200 ml-2"></span>
        </div> */}

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

        {/* Guest Access Button */}
       
      </div>
    </div>
    )
}

export default Signup;