import React from 'react';
import Navbar from './Navbar';
import { FaBolt } from 'react-icons/fa';
import { NavLink } from 'react-router';

function LandingPage () {
  return (
    <>
       
        <div className="bg-[#f9fcff] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-12 gap-10">
        {/* Left: Text Content */}
            <div className="max-w-xl">
                {/* Top Badge */}
                <div className="flex items-center bg-blue-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold w-fit mb-4">
                <FaBolt className="text-blue-500 mr-2" />
                Trusted by 50,000+ Athletes
                </div>

                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900 mb-4">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">Personalized</span><br />
                Athletic Journey<br />
                Starts Here
                </h1>

                {/* Subtitle */}
                <p className="text-gray-500 text-lg mb-6">
                Get customized diet plans, fitness schedules, and injury prevention strategies designed specifically for your sport, role, and goals.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                <NavLink to="/signup" className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-lg font-semibold text-center shadow hover:opacity-90 transition">
                    Start Your Journey →
                </NavLink>
                <a href="#" className="bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-lg font-semibold text-center shadow hover:bg-gray-100 transition">
                    View Demo
                </a>
                </div>
            </div>

            {/* Right: Profile Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 relative">
                <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Your Athletic Profile</h3>
                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">Active</span>
                </div>

                {/* Profile Grid */}
                <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-600 mb-6">
                    <div>
                        <p className="text-gray-400">Sport</p>
                        <p className="font-semibold text-gray-800">Football</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Position</p>
                        <p className="font-semibold text-gray-800">Midfielder</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Goal</p>
                        <p className="font-semibold text-gray-800">Stamina</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Level</p>
                        <p className="font-semibold text-gray-800">Professional</p>
                    </div>
                </div>

                {/* Progress */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-gray-600">Weekly Progress</p>
                        <p className="text-sm font-semibold text-green-600">85%</p>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default LandingPage;
