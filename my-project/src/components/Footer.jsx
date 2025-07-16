import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Left: Logo + Contact Info */}
        <div className="space-y-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-lg flex items-center justify-center text-white text-xl font-bold">
              <span>A</span> {/* Logo (A) */}
            </div>
            <span className="text-2xl font-semibold text-gray-900">AthleteX</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm">
            Personalized health and performance planning for athletes across all sports. Achieve your fitness goals with customized diet plans, workout schedules, and injury prevention.
          </p>

          {/* Contact Info */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <FaEnvelope className="mr-2 text-gray-400" />
              <a href="mailto:support@athletex.com">support@athletex.com</a>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaPhoneAlt className="mr-2 text-gray-400" />
              <a href="tel:+15551234567">+1 (555) 123-4567</a>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-gray-400" />
              San Francisco, CA
            </div>
          </div>
        </div>

        {/* Product Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Success Stories</a></li>
            <li><a href="#">Help Center</a></li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer Text */}
      <div className="text-center text-sm text-gray-500 mt-10">
        <p>© 2025 AthleteX. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
