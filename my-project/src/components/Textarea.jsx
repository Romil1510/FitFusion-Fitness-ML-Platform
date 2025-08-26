import React from 'react';
import { FaBasketballBall, FaFootballBall, FaBaseballBall, FaTableTennis, FaRunning, FaSwimmer, FaChartLine, FaHeartbeat, FaDumbbell, FaQuoteLeft } from 'react-icons/fa';

function Textarea() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 py-20 px-6 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Elevate Your Athletic Performance
          </h1>
          <p className="text-xl sm:text-2xl max-w-3xl mx-auto mb-10 opacity-90">
            Advanced training insights, injury prevention, and performance optimization for athletes of all levels
          </p>
          <button className="bg-white text-blue-700 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            Get Started Today
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-800/30 z-0"></div>
      </section>

      {/* Sports Icons Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Supporting Athletes Across All Sports
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-16">
            From team sports to individual disciplines, we provide specialized guidance for every athletic pursuit.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 justify-center place-items-center mb-20">
            {[
              { icon: FaBasketballBall, color: 'blue', name: 'Basketball' },
              { icon: FaFootballBall, color: 'green', name: 'Football' },
              { icon: FaBaseballBall, color: 'red', name: 'Baseball' },
              { icon: FaTableTennis, color: 'yellow', name: 'Table Tennis' },
              { icon: FaRunning, color: 'purple', name: 'Running' },
              { icon: FaSwimmer, color: 'teal', name: 'Swimming' }
            ].map((sport, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className={`w-20 h-20 rounded-full bg-${sport.color}-100 flex items-center justify-center mb-4 transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg`}>
                  <sport.icon className={`text-${sport.color}-600 text-3xl`} />
                </div>
                <span className="text-gray-700 font-medium">{sport.name}</span>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to Excel
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-16">
            Comprehensive tools and insights to optimize your performance, prevent injuries, and achieve your athletic goals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: FaChartLine, title: 'Performance Analytics', desc: 'Track and analyze your performance metrics with advanced visualization tools.', color: 'blue' },
              { icon: FaHeartbeat, title: 'Injury Prevention', desc: 'Identify potential risks and prevent injuries before they happen with our AI-powered system.', color: 'green' },
              { icon: FaDumbbell, title: 'Custom Workouts', desc: 'Personalized training programs designed for your specific sport and goals.', color: 'red' }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-lg bg-${feature.color}-100 flex items-center justify-center mb-6 mx-auto`}>
                  <feature.icon className={`text-${feature.color}-600 text-2xl`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-center">
            What Athletes Say
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-16 text-center">
            Hear from professional and amateur athletes who have transformed their performance with our platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Jessica Smith', role: 'Professional Basketball Player', text: 'This platform completely changed how I train. My performance improved by 22% in just one season!' },
              { name: 'Mike Johnson', role: 'College Football Athlete', text: 'The injury prevention insights helped me stay healthy throughout the entire season. A game-changer!' },
              { name: 'Chris Williams', role: 'Swimming Coach', text: 'As a coach, this platform gives me the data I need to optimize each player\'s training regimen.' }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-md">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Athletic Journey?
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 opacity-90">
            Join thousands of athletes who are already achieving their goals with our comprehensive platform.
          </p>
          <button className="bg-white text-blue-700 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            Start Your Free Trial
          </button>
        </div>
      </section>
    </>
  );
}

export default Textarea;