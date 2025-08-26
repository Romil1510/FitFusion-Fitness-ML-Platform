import React from 'react';
import { FaBullseye, FaCalendarAlt, FaShieldAlt, FaChartBar, FaUsers, FaTrophy, FaArrowRight } from 'react-icons/fa';

const features = [
  {
    icon: <FaBullseye className="text-white text-xl" />,
    title: 'Personalized Plans',
    description: 'Get customized diet and fitness plans tailored to your sport, role, and fitness goals.',
    gradient: 'from-blue-500 to-blue-600',
    color: 'blue'
  },
  {
    icon: <FaCalendarAlt className="text-white text-xl" />,
    title: 'Weekly Schedules',
    description: 'Organized weekly schedules with detailed workouts, meals, and recovery tips.',
    gradient: 'from-green-500 to-green-600',
    color: 'green'
  },
  {
    icon: <FaShieldAlt className="text-white text-xl" />,
    title: 'Injury Prevention',
    description: 'Sport-specific injury prevention advice and rehabilitation exercises.',
    gradient: 'from-orange-500 to-orange-600',
    color: 'orange',
    active: true, // visually emphasized card
  },
  {
    icon: <FaChartBar className="text-white text-xl" />,
    title: 'Progress Tracking',
    description: 'Monitor your progress with detailed analytics and performance insights.',
    gradient: 'from-purple-500 to-purple-600',
    color: 'purple'
  },
  {
    icon: <FaUsers className="text-white text-xl" />,
    title: 'Expert Guidance',
    description: 'Plans designed by certified nutritionists and fitness professionals.',
    gradient: 'from-indigo-500 to-indigo-600',
    color: 'indigo'
  },
  {
    icon: <FaTrophy className="text-white text-xl" />,
    title: 'Goal Achievement',
    description: "Whether it's stamina, muscle gain, or recovery – we help you reach your goals.",
    gradient: 'from-teal-500 to-teal-600',
    color: 'teal'
  },
];

function Herosec() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the features that make our fitness platform the perfect choice for achieving your athletic goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-2xl bg-white transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl ${
                feature.active 
                  ? 'ring-4 ring-blue-500 ring-opacity-50 border-blue-100' 
                  : 'border border-gray-100'
              }`}
            >
              {/* Icon Container */}
              <div className={`absolute -top-6 left-6 w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <div className="pt-6">
                <h3 className={`text-xl font-bold mb-3 group-hover:text-${feature.color}-600 transition-colors`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Learn More Link */}
                <div className="flex items-center mt-6">
                  <span className={`text-${feature.color}-600 font-medium text-sm mr-2 group-hover:mr-3 transition-all`}>
                    Learn more
                  </span>
                  <FaArrowRight className={`text-${feature.color}-500 text-xs group-hover:translate-x-1 transition-transform`} />
                </div>
              </div>
              
              {/* Hover Effect Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-10 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Fitness Journey?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of athletes who have already achieved their goals with our personalized fitness plans
            </p>
            <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Herosec;