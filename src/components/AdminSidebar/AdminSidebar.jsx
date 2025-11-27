import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function AdminSidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // detect screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // lock scroll when sidebar open
  useEffect(() => {
    if (isMobile && isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => (document.body.style.overflow = "auto");
  }, [isMobile, isOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/manage", label: "Manage Content" },
    { to: "/admin/create-user", label: "Create User" },
    { to: "/admin/subscribers", label: "Subscribers" },
  ];

  return (
    <>
      {/* Hamburger button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-[9999] p-3 rounded-xl bg-green-600 text-white shadow-lg 
          hover:bg-green-700 active:scale-95 transition"
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white p-6 
          flex flex-col justify-between z-50 border-r border-gray-200
          transition-transform duration-300 ease-out transform
          w-64
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
        `}
      >
        <div>
          <h2 className="text-3xl font-extrabold mb-10 text-green-700 select-none">
            Admin Panel
          </h2>

          <nav className="flex flex-col space-y-4">
            {menuItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `
                  block w-full px-5 py-3 rounded-xl text-lg font-medium tracking-wide
                  transition-all duration-200 shadow-sm
                  ${
                    isActive
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
                  }
                  ${isMobile ? "text-center w-full active:bg-green-200" : ""}
                  `
                }
                onClick={() => isMobile && setIsOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl 
          font-semibold shadow-lg hover:bg-green-700 active:scale-95 transition"
        >
          Logout
        </button>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}
    </>
  );
}
