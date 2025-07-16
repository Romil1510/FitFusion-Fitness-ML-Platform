import { useState } from 'react';
import { FaHome, FaFileAlt, FaCalendarAlt, FaUser, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Toggle mobile menu visibility
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-white shadow-md w-full mt-4 mb-4 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-md flex items-center justify-center text-white text-sm font-bold">
                            <span>🏋️</span> {/* Replace with logo icon if needed */}
                        </div>
                        <span className="text-2xl font-bold text-blue-400">
                            FitFusio<span className="text-green-400">N</span>
                        </span>
                    </div>

                    {/* Hamburger Menu Icon for Mobile */}
                    <div className="md:hidden">
                        <button onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? <FaTimes className="text-2xl text-gray-600" /> : <FaBars className="text-2xl text-gray-600" />}
                        </button>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex space-x-8 items-center text-gray-600 text-base font-medium">
                        <a href="#" className="flex items-center text-blue-400 font-semibold bg-blue-100 px-4 py-2 rounded-lg">
                            <FaHome className="mr-2" />
                            Home
                        </a>
                        <a href="#" className="flex items-center text-gray-600 hover:text-blue-400 transition">
                            <FaFileAlt className="mr-2" />
                            Get Started
                        </a>
                        <a href="#" className="flex items-center text-gray-600 hover:text-blue-400 transition">
                            <FaCalendarAlt className="mr-2" />
                            My Plans
                        </a>
                        <a href="#" className="flex items-center text-gray-600 hover:text-blue-400 transition">
                            <FaUser className="mr-2" />
                            Dashboard
                        </a>
                    </div>

                    {/* Right Auth Buttons */}
                    <div className="hidden lg:flex md:flex flex items-center space-x-6 text-base font-medium">
                        <a href="#" className="lg:block text-gray-600 hover:text-blue-400 transition">Sign In</a>
                        <a
                            href="#"
                            className=" lg:block bg-gradient-to-r from-blue-400 to-green-400 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Hidden by default, shows when the menu is toggled */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden md:px-[10px]  bg-white shadow-lg py-4 px-6`}>
                <a href="#" className="block text-blue-400 py-2 font-semibold">
                    <FaHome className="mr-2 inline" />
                    Home
                </a>
                <a href="#" className="block text-gray-600 hover:text-blue-400 py-2">
                    <FaFileAlt className="mr-2 inline" />
                    Get Started
                </a>
                <a href="#" className="block text-gray-600 hover:text-blue-400 py-2">
                    <FaCalendarAlt className="mr-2 inline" />
                    My Plans
                </a>
                <a href="#" className="block text-gray-600 hover:text-blue-400 py-2">
                    <FaUser className="mr-2 inline" />
                    Dashboard
                </a>

                {/* Mobile Auth Buttons */}
                <div className="mt-4 space-y-4">
                    <a href="#" className="block text-gray-600 hover:text-blue-400 py-2">Sign In</a>
                    <a
                        href="#"
                        className="block bg-gradient-to-r from-blue-400 to-green-400 text-white py-2 rounded-full font-semibold text-center"
                    >
                        Get Started
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
