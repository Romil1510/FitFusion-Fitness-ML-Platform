import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaArrowRight } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-700">
          {/* Company info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-400 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                <span>A</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">AthleteX</span>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Personalized health and performance planning for athletes across all sports. 
              Achieve your fitness goals with customized diet plans, workout schedules, 
              and injury prevention strategies.
            </p>

            {/* Newsletter subscription */}
            <div className="pt-4">
              <h4 className="font-semibold text-white mb-3">Stay Updated</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
                />
                <button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 px-4 rounded-r-lg flex items-center transition-all duration-300">
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white text-lg mb-5 pb-2 relative inline-block after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-green-500">
              Product
            </h3>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Success Stories', 'Help Center'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-gray-500 rounded-full mr-2 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-green-500"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white text-lg mb-5 pb-2 relative inline-block after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-green-500">
              Company
            </h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-gray-500 rounded-full mr-2 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-green-500"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white text-lg mb-5 pb-2 relative inline-block after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-green-500">
              Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mt-1 mr-3 text-blue-400">
                  <FaEnvelope />
                </div>
                <a href="mailto:support@athletex.com" className="text-gray-300 hover:text-white text-sm transition-colors duration-300">
                  support@Fitfusion.com
                </a>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-3 text-blue-400">
                  <FaPhoneAlt />
                </div>
                <a href="tel:+15551234567" className="text-gray-300 hover:text-white text-sm transition-colors duration-300">
                  +91 9876543210
                </a>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-3 text-blue-400">
                  <FaMapMarkerAlt />
                </div>
                <span className="text-gray-300 text-sm">New Ranip,Ahmedabad</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-6">
              <h4 className="font-semibold text-white text-sm mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                {[
                  { icon: FaTwitter, color: 'hover:text-blue-400' },
                  { icon: FaFacebook, color: 'hover:text-blue-600' },
                  { icon: FaInstagram, color: 'hover:text-pink-500' },
                  { icon: FaLinkedin, color: 'hover:text-blue-500' }
                ].map((SocialIcon, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 transition-all duration-300 ${SocialIcon.color} hover:bg-gray-700`}
                  >
                    <SocialIcon.icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8">
          <p className="text-gray-400 text-sm">© 2025 FItfusion. All rights reserved.</p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;