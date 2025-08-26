import React from 'react';

const testimonials = [
  {
    initial: 'S',
    name: 'Sarah Chen',
    sport: 'Swimming Athlete',
    text: '“AthleteX transformed my training. The personalized nutrition plan helped me break my personal records!”',
    rating: 5,
    image: 'swimmer'
  },
  {
    initial: 'M',
    name: 'Marcus Johnson',
    sport: 'Football Athlete',
    text: '“The injury prevention tips saved my season. I\'m stronger and more confident than ever.”',
    rating: 4,
    image: 'football'
  },
  {
    initial: 'P',
    name: 'Priya Patel',
    sport: 'Cricket Athlete',
    text: '“Finally, a platform that understands different sports. My batting performance improved significantly.”',
    rating: 5,
    image: 'cricket'
  },
];

function Reviewsec() {
  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-r from-blue-500/5 to-green-500/5 transform -skew-y-3 -translate-y-16"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Athletes Worldwide</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from athletes who transformed their performance with AthleteX
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Rating Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 text-lg italic mb-6 leading-relaxed text-center relative">
                <svg className="w-8 h-8 text-blue-500/20 absolute -top-2 -left-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                {item.text}
              </p>

              {/* Athlete Info */}
              <div className="mt-auto flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
                  {item.initial}
                </div>
                <div className="text-left">
                  <p className="text-gray-900 font-bold">{item.name}</p>
                  <p className="text-gray-500 text-sm">{item.sport}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">Join thousands of satisfied athletes today</p>
          <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  );
}

export default Reviewsec;