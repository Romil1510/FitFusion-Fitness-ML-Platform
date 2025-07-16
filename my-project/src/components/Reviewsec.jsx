import React from 'react';

const testimonials = [
  {
    initial: 'S',
    name: 'Sarah Chen',
    sport: 'Swimming Athlete',
    text: '“AthleteX transformed my training. The personalized nutrition plan helped me break my personal records!”',
  },
  {
    initial: 'M',
    name: 'Marcus Johnson',
    sport: 'Football Athlete',
    text: '“The injury prevention tips saved my season. I\'m stronger and more confident than ever.”',
  },
  {
    initial: 'P',
    name: 'Priya Patel',
    sport: 'Cricket Athlete',
    text: '“Finally, a platform that understands different sports. My batting performance improved significantly.”',
  },
];

function Reviewsec () {
  return (
    <section className="bg-[#f9f9f9] py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Trusted by Athletes Worldwide
        </h2>
        <p className="text-gray-500 text-base sm:text-lg mb-10">
          Real stories from athletes who transformed their performance with AthleteX
        </p>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition hover:shadow-md"
            >
              {/* Initial Circle */}
              <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-lg">
                {item.initial}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 italic mb-4 leading-relaxed">{item.text}</p>

              {/* Athlete Info */}
              <p className="text-gray-900 font-semibold">{item.name}</p>
              <p className="text-gray-500 text-sm">{item.sport}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviewsec;
