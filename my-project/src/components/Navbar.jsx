import { useState } from 'react';
import { FaHome, FaFileAlt, FaCalendarAlt, FaUser, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { NavLink } from 'react-router';
import {useAuth} from "./AuthContext"

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isLoggedIn, login, logout } = useAuth(); 
    const getNavLinkClass = ({ isActive }) =>
        `flex items-center px-4 py-2 rounded-lg transition ${
            isActive ? 'bg-blue-100 text-blue-500 font-semibold' : 'text-gray-600 hover:text-blue-400'
        }`;
        const getMobileNavClass = ({ isActive }) =>
            `block py-2 rounded-md transition ${
                isActive ? 'bg-blue-100 text-blue-500 font-semibold' : 'text-gray-600 hover:text-blue-400'
            }`;

    // Toggle mobile menu visibility
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-white  w-full mt-3 py-1 font-poppins">
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
                      {/* <div  className="flex items-center text-blue-400 font-semibold bg-blue-100 px-4 py-2 rounded-lg> */}
                            <NavLink to="/" className={getNavLinkClass}>
                            <FaHome className="mr-2" />
                            Home
                           </NavLink>
                       
                       
                        <NavLink to="/signup" className={getNavLinkClass}>
                            <FaFileAlt className="mr-2" />
                            Get Started
                        </NavLink>
                        <NavLink to="/ke" className={getNavLinkClass}>
                            <FaCalendarAlt className="mr-2" />
                            My Plans
                        </NavLink>
                        <NavLink to="/le" className={getNavLinkClass}>
                            <FaUser className="mr-2" />
                            Dashboard
                        </NavLink>
                    </div>
                    
                    {/* Right Auth Buttons */}
                    {
                        isLoggedIn?(
                            <div className="flex items-center space-x-4">
          <FaUserCircle className="text-2xl text-blue-500" />
          <button onClick={logout} className="text-red-500 text-sm">Logout</button>
        </div>
                        ):(
                            <div className="hidden lg:flex md:flex flex items-center space-x-6 text-base font-medium">
                            <NavLink to="/login" className={({ isActive }) =>
                                `transition ${
                                    isActive ? 'text-blue-500 font-semibold' : 'text-gray-600 hover:text-blue-400'
                                }`
                            }>Sign In</NavLink>
                            <NavLink
                                to="/signup"
                                className="bg-gradient-to-r from-blue-400 to-green-400 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition"
    
                            >
                                Get Started
                            </NavLink>
                        </div>
                        )
                    }
                   
                </div>
            </div>

            {/* Mobile Menu - Hidden by default, shows when the menu is toggled */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden md:px-[10px]  bg-white shadow-lg py-4 px-6`}>
                <NavLink to="/" className={getMobileNavClass}>
                    <FaHome className="mr-2 inline" />
                    Home
                </NavLink>
                <NavLink to="/signup" className={getMobileNavClass}>
                    <FaFileAlt className="mr-2 inline" />
                    Get Started
                </NavLink>
                <NavLink to="/ke" className={getMobileNavClass}>
                    <FaCalendarAlt className="mr-2 inline" />
                    My Plans
                </NavLink>
                <NavLink to="/pe"  className={getMobileNavClass}>
                    <FaUser className="mr-2 inline" />
                    Dashboard
                </NavLink>

                {/* Mobile Auth Buttons */}
                <div className="mt-4 space-y-4">
                    <NavLink to="/login" className={getMobileNavClass}>
                        Sign In
                    </NavLink>
                    <NavLink to="/signup" className="block bg-gradient-to-r from-blue-400 to-green-400 text-white py-2 rounded-full font-semibold text-center">
                        Get Started
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
