import React from 'react';
import { FaBasketballBall, FaFootballBall, FaBaseballBall, FaTableTennis, FaRunning, FaSwimmer } from 'react-icons/fa';

function Textarea () {
  return (
    <>
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
          Supporting Athletes Across All Sports
        </h2>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          From team sports to individual disciplines, we provide specialized guidance for every athletic pursuit.
        </p>

        {/* Sport Icons */}
         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 justify-center place-items-center">
          {/* Basketball Icon */}
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <FaBasketballBall className="text-blue-600 text-3xl" />
          </div>

          {/* Football Icon */}
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <FaFootballBall className="text-green-600 text-3xl" />
          </div>

          {/* Baseball Icon */}
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <FaBaseballBall className="text-red-600 text-3xl" />
          </div>

          {/* Table Tennis Icon */}
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <FaTableTennis className="text-yellow-600 text-3xl" />
          </div>

          {/* Running Icon */}
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
            <FaRunning className="text-purple-600 text-3xl" />
          </div>

          {/* Swimming Icon */}
          <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
            <FaSwimmer className="text-teal-600 text-3xl" />
          </div>
        </div>
      </div>
    </section>
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
          Everything You Need to Excel
        </h2>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
          Comprehensive tools and insights to optimize your performance, prevent injuries, and achieve your athletic goals.
        </p>
      </div>
    </section>
    </>
  );
};

export default Textarea;