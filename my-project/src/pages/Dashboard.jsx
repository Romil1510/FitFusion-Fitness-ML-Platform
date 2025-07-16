import React from 'react';
import { FaUser, FaChartLine, FaTrophy } from 'react-icons/fa';

function Dashboard () {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen flex flex-col items-center justify-center py-16 px-6">
      {/* Header Section */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-4">
        Athlete Dashboard
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 text-center mb-12">
        Track your progress, manage your profile, and analyze your performance
      </p>

      {/* Dashboard Coming Soon Section */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl text-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard Coming Soon</h2>
        <p className="text-gray-500 text-sm mb-6">
          Your comprehensive athlete dashboard is under development. Soon you'll be able to:
        </p>

        {/* Feature Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl">
              <FaUser />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Profile Management</h3>
              <p className="text-sm text-gray-500">Update your athletic profile and preferences</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl">
              <FaChartLine />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Performance Analytics</h3>
              <p className="text-sm text-gray-500">Detailed insights into your progress</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl">
              <FaTrophy />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Achievement Tracking</h3>
              <p className="text-sm text-gray-500">Celebrate your milestones and goals</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-6">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition">
            Start Assessment
          </button>
          <button className="bg-white text-gray-600 border border-gray-300 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-100 transition">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
