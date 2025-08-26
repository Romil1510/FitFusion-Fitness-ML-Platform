// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaHome, FaFileAlt, FaCalendarAlt, FaUser, FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "./AuthContext";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 ${
      isActive 
        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" 
        : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
    }`;

  const getMobileNavClass = ({ isActive }) =>
    `flex items-center py-3 px-4 rounded-xl transition-all ${
      isActive 
        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" 
        : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
    }`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg py-0" : "bg-gradient-to-r from-blue-50 to-indigo-50 py-2"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:scale-105 transition-transform duration-300">
              <span className="text-lg">🏋️</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FitFusio<span className="text-green-500">N</span>
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2 items-center text-gray-600 text-base font-medium">
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
            <NavLink to="/dashboard" className={getNavLinkClass}>
              <FaUser className="mr-2" />
              Dashboard
            </NavLink>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <NavLink to="/ml-form" className="hidden md:flex items-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                  <FaFileAlt className="mr-2" />
                  Predict Plan
                </NavLink>
                
                <div className="relative group">
                  <NavLink to="/profile" className="flex items-center space-x-2 p-2 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                    <div className="w-9 h-9 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white">
                      {user?.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle className="text-lg" />}
                    </div>
                    <span className="hidden lg:inline text-gray-700 font-medium">{user?.name || "User"}</span>
                  </NavLink>
                  
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                    <NavLink to="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors">
                      <FaUserCircle className="mr-2 text-blue-500" />
                      Profile
                    </NavLink>
                    <button 
                      onClick={logout} 
                      className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <NavLink
                  to="/login"
                  className="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:text-blue-500 transition-colors duration-300"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Get Started
                </NavLink>
              </div>
            )}

            {/* Hamburger for Mobile */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors duration-300"
            >
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden bg-white shadow-xl rounded-b-2xl mx-4 overflow-hidden transition-all duration-300`}>
        <div className="py-4 px-5 space-y-2">
          <NavLink to="/" className={getMobileNavClass} onClick={() => setIsMobileMenuOpen(false)}>
            <FaHome className="mr-3" />
            Home
          </NavLink>
          <NavLink to="/signup" className={getMobileNavClass} onClick={() => setIsMobileMenuOpen(false)}>
            <FaFileAlt className="mr-3" />
            Get Started
          </NavLink>
          <NavLink to="/ke" className={getMobileNavClass} onClick={() => setIsMobileMenuOpen(false)}>
            <FaCalendarAlt className="mr-3" />
            My Plans
          </NavLink>
          <NavLink to="/dashboard" className={getMobileNavClass} onClick={() => setIsMobileMenuOpen(false)}>
            <FaUser className="mr-3" />
            Dashboard
          </NavLink>
          
          {isLoggedIn && (
            <NavLink to="/ml-form" className={getMobileNavClass} onClick={() => setIsMobileMenuOpen(false)}>
              <FaFileAlt className="mr-3" />
              Predict Plan
            </NavLink>
          )}

          {/* Mobile Auth */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            {isLoggedIn ? (
              <>
                <div className="flex items-center px-4 py-3 mb-2 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white mr-3">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle className="text-lg" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{user?.name || "User"}</p>
                    <p className="text-sm text-gray-500">{user?.email || ""}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }} 
                  className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={getMobileNavClass} 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-semibold shadow-md mt-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;