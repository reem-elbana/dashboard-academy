import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { token, userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md fixed inset-x-0 top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3 flex items-center justify-between">

        <p className="text-lime-600 font-bold text-xl">ALforsan Academy</p>

        {/* Desktop Links */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          {token && userRole === "user" && (
            <>
              <NavLink to="/user/home" className="hover:text-green-600">Home</NavLink>
              <NavLink to="/user/profile" className="hover:text-green-600">Profile</NavLink>
              <NavLink to="/user/offers" className="hover:text-green-600">Offers</NavLink>
              <NavLink to="/user/sports" className="hover:text-green-600">Sports</NavLink>
            </>
          )}
        </div>

        {/* Auth Links */}
        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          {token ? (
            <button
              onClick={handleLogout}
              className="text-red-600 font-medium hover:text-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="text-green-600 font-medium hover:text-green-700">
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Button */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md px-6 py-4 space-y-4">
          {token && userRole === "user" && (
            <>
              <NavLink to="/user/home" onClick={() => setIsOpen(false)}>Home</NavLink>
              <NavLink to="/user/profile" onClick={() => setIsOpen(false)}>Profile</NavLink>
              <NavLink to="/user/offers" onClick={() => setIsOpen(false)}>Offers</NavLink>
              <NavLink to="/user/sports" onClick={() => setIsOpen(false)}>Sports</NavLink>
            </>
          )}
          {token ? (
            <button onClick={handleLogout} className="text-red-600 font-medium">Logout</button>
          ) : (
            <NavLink to="/login" onClick={() => setIsOpen(false)}>Login</NavLink>
          )}
        </div>
      )}
    </header>
  );
}
