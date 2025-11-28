import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";

export default function AdminSidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [lang, setLang] = useState(i18n.language);

  // toggle language
  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    setLang(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

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

  useEffect(() => {
    if (isMobile && isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMobile, isOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { to: "/admin/dashboard", label: t("dashboard") },
    { to: "/admin/users", label: t("users") },
    { to: "/admin/manage", label: t("manageContent") },
    { to: "/admin/create-user", label: t("createUser") },
    { to: "/admin/subscribers", label: t("subscribers") },
    { to: "/admin/banners", label: t("banners") },
    { to: "/admin/categories", label: t("categories") },
  ];

  return (
    <>
      {/* Hamburger button for mobile */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="fixed top-4 left-4 z-[9999] p-3 rounded-xl bg-green-600 text-white shadow-lg 
          hover:bg-green-700 active:scale-95 transition"
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
        className={`fixed top-0 left-0 h-full bg-white p-6 
        flex flex-col justify-between z-50 border-r border-gray-200
        transition-transform duration-300 w-64
        ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
        `}
      >
        <div>
          {/* Admin Panel title + language toggle */}
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-green-700 select-none mb-3">
              {t("adminPanel")}
            </h2>

            {/* Language Toggle under title */}
            <div className="flex gap-2">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm font-medium hover:bg-gray-300 transition"
              >
                {lang === "en" ? "AR" : "EN"}
              </button>
            </div>
          </div>

          {/* Menu items */}
          <nav className="flex flex-col space-y-4">
            {menuItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `
                  block px-5 py-3 rounded-xl text-lg font-medium
                  transition-all duration-200 shadow-sm
                  ${
                    isActive
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
                  }
                  ${isMobile ? "text-center" : ""}
                  `
                }
                onClick={() => isMobile && setIsOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl 
          font-semibold shadow-lg hover:bg-green-700 active:scale-95 transition"
        >
          {t("logout")}
        </button>
      </aside>

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}
    </>
  );
}
