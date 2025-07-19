// src/components/Navbar.jsx
import { useState } from 'react';
import { FaHome, FaFileAlt, FaCalendarAlt, FaUser, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { useAuth } from "./AuthContext";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, logout, userData } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-100 text-blue-500 font-semibold' : 'text-gray-600 hover:text-blue-400'}`;

  const getMobileNavClass = ({ isActive }) =>
    `block py-2 rounded-md transition ${isActive ? 'bg-blue-100 text-blue-500 font-semibold' : 'text-gray-600 hover:text-blue-400'}`;

  return (
    <nav className="bg-white w-full mt-3 py-1 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-md flex items-center justify-center text-white text-sm font-bold">
              <span>🏋️</span>
            </div>
            <span className="text-2xl font-bold text-blue-400">FitFusio<span className="text-green-400">N</span></span>
          </div>

          <div className="md:hidden">
            <button onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <FaTimes className="text-2xl text-gray-600" /> : <FaBars className="text-2xl text-gray-600" />}
            </button>
          </div>

          <div className="hidden md:flex space-x-8 items-center text-gray-600 text-base font-medium">
            <NavLink to="/" className={getNavLinkClass}><FaHome className="mr-2" /> Home</NavLink>
            <NavLink to="/signup" className={getNavLinkClass}><FaFileAlt className="mr-2" /> Get Started</NavLink>
            <NavLink to="/ke" className={getNavLinkClass}><FaCalendarAlt className="mr-2" /> My Plans</NavLink>
            <NavLink to="/le" className={getNavLinkClass}><FaUser className="mr-2" /> Dashboard</NavLink>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              {userData?.profilePic ? (
                <img src={userData.profilePic} alt="Profile" className="w-8 h-8 rounded-full" />
              ) : (
                <FaUserCircle className="text-2xl text-blue-500" />
              )}
              <button onClick={logout} className="text-red-500 text-sm">Logout</button>
            </div>
          ) : (
            <div className="hidden lg:flex md:flex items-center space-x-6 text-base font-medium">
              <NavLink to="/login" className={({ isActive }) => `transition ${isActive ? 'text-blue-500 font-semibold' : 'text-gray-600 hover:text-blue-400'}`}>Sign In</NavLink>
              <NavLink to="/signup" className="bg-gradient-to-r from-blue-400 to-green-400 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition">
                Get Started
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-lg py-4 px-6`}>
        <NavLink to="/" className={getMobileNavClass}><FaHome className="mr-2 inline" /> Home</NavLink>
        <NavLink to="/signup" className={getMobileNavClass}><FaFileAlt className="mr-2 inline" /> Get Started</NavLink>
        <NavLink to="/ke" className={getMobileNavClass}><FaCalendarAlt className="mr-2 inline" /> My Plans</NavLink>
        <NavLink to="/pe" className={getMobileNavClass}><FaUser className="mr-2 inline" /> Dashboard</NavLink>

        <div className="mt-4 space-y-4">
          {isLoggedIn ? (
            <button onClick={logout} className="block w-full text-red-500 text-center font-semibold">Logout</button>
          ) : (
            <>
              <NavLink to="/login" className={getMobileNavClass}>Sign In</NavLink>
              <NavLink to="/signup" className="block bg-gradient-to-r from-blue-400 to-green-400 text-white py-2 rounded-full font-semibold text-center">
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
