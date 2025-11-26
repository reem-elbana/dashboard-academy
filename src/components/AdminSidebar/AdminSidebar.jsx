import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function AdminSidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // تحديث حالة الموبايل وحالة فتح القائمة حسب حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile); // افتح القائمة افتراضياً على الديسكتوب، واقفلها على الموبايل
    };
    window.addEventListener("resize", handleResize);

    handleResize(); // إعداد أولي عند التحميل

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // منع الـ scroll في الـ body لما القائمة مفتوحة على الموبايل
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* زر الهامبرجر للهواتف */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-[9999] p-2 rounded-md bg-green-600 text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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

      {/* الشريط الجانبي */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl p-6 flex flex-col justify-between
          transition-transform duration-300 ease-in-out z-40
          w-64
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
        `}
      >
        {/* القائمة */}
        <div>
          <h2 className="text-2xl font-bold mb-8 text-green-700 select-none">Admin Panel</h2>

          <nav className="flex flex-col space-y-5 text-lg">
            {[
              { to: "/admin/dashboard", label: "Dashboard" },
              { to: "/admin/users", label: "Users" },
              { to: "/admin/manage", label: "Manage Content" },
              { to: "/admin/create-user", label: "Create User" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                  }`
                }
                onClick={() => isMobile && setIsOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* زر تسجيل الخروج */}
        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 transition"
        >
          Logout
        </button>
      </aside>

      {/* خلفية داكنة عند فتح القائمة على الموبايل */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          aria-hidden="true"
        />
      )}
    </>
  );
}
