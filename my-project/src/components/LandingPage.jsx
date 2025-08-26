import React from 'react';
import { FaBolt, FaArrowRight, FaChartLine, FaFire, FaHeartbeat, FaTrophy } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left: Text Content */}
          <div className="flex-1 max-w-2xl">
            {/* Top Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <FaBolt className="text-blue-500 mr-2" />
              Trusted by 50,000+ Athletes Worldwide
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Personalized</span> Athletic Journey Starts Here
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Get customized diet plans, fitness schedules, and injury prevention strategies designed specifically for your sport, role, and goals. Powered by AI to maximize your performance.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">10k+</div>
                <div className="text-sm text-gray-500">Training Plans</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-500">Support</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <NavLink 
                to="/signup" 
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Your Journey <FaArrowRight className="ml-2" />
              </NavLink>
              <a 
                href="#" 
                className="inline-flex items-center justify-center bg-white text-gray-800 border border-gray-200 px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
              >
                View Demo
              </a>
            </div>
          </div>

          {/* Right: Profile Card */}
          <div className="flex-1 max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Your Athletic Profile</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Active
                  </span>
                </div>
                <p className="text-blue-100 mt-2">Personalized for maximum performance</p>
              </div>

              {/* Profile Content */}
              <div className="p-6">
                {/* Profile Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-500 mb-1">
                      <FaFire className="inline text-sm mr-1" />
                      <span className="text-xs font-medium">SPORT</span>
                    </div>
                    <p className="font-semibold text-gray-800">Football</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-green-500 mb-1">
                      <FaTrophy className="inline text-sm mr-1" />
                      <span className="text-xs font-medium">POSITION</span>
                    </div>
                    <p className="font-semibold text-gray-800">Midfielder</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-purple-500 mb-1">
                      <FaChartLine className="inline text-sm mr-1" />
                      <span className="text-xs font-medium">GOAL</span>
                    </div>
                    <p className="font-semibold text-gray-800">Stamina</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-orange-500 mb-1">
                      <FaHeartbeat className="inline text-sm mr-1" />
                      <span className="text-xs font-medium">LEVEL</span>
                    </div>
                    <p className="font-semibold text-gray-800">Professional</p>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">Weekly Progress</p>
                    <p className="text-sm font-bold text-green-600">85% Complete</p>
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">5 of 7 workouts completed this week</p>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                    View Plan
                  </button>
                  <button className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                    Adjust Goals
                  </button>
                </div>
              </div>
            </div>

            {/* Floating elements for visual interest */}
            <div className="hidden md:block">
              <div className="absolute -z-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20 -translate-y-48 translate-x-32"></div>
              <div className="absolute -z-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-20 translate-y-48 -translate-x-32"></div>
            </div>
          </div>
        </div>

        {/* Testimonial snippet */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 italic max-w-2xl mx-auto">
            "This platform transformed my training regimen. I've seen a 30% improvement in my stamina and recovery time in just 3 months!"
            <span className="block font-medium text-gray-700 mt-2">- Alex Morgan, Professional Footballer</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;