import React from 'react';
import { FaBullseye, FaCalendarAlt, FaShieldAlt, FaChartBar, FaUsers, FaTrophy } from 'react-icons/fa';

const features = [
  {
    icon: <FaBullseye className="text-blue-500 text-2xl" />,
    title: 'Personalized Plans',
    description: 'Get customized diet and fitness plans tailored to your sport, role, and fitness goals.',
  },
  {
    icon: <FaCalendarAlt className="text-green-500 text-2xl" />,
    title: 'Weekly Schedules',
    description: 'Organized weekly schedules with detailed workouts, meals, and recovery tips.',
  },
  {
    icon: <FaShieldAlt className="text-orange-500 text-2xl" />,
    title: 'Injury Prevention',
    description: 'Sport-specific injury prevention advice and rehabilitation exercises.',
    active: true, // visually emphasized card
  },
  {
    icon: <FaChartBar className="text-purple-500 text-2xl" />,
    title: 'Progress Tracking',
    description: 'Monitor your progress with detailed analytics and performance insights.',
  },
  {
    icon: <FaUsers className="text-blue-600 text-2xl" />,
    title: 'Expert Guidance',
    description: 'Plans designed by certified nutritionists and fitness professionals.',
  },
  {
    icon: <FaTrophy className="text-green-600 text-2xl" />,
    title: 'Goal Achievement',
    description: "Whether it's stamina, muscle gain, or recovery – we help you reach your goals.",
  },
];

function Herosec () {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 border rounded-xl bg-white transition shadow-sm hover:shadow-md ${
                feature.active ? 'border-blue-200 shadow-lg' : 'border-gray-200'
              }`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Herosec;
