import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";

// أيقونات بسيطة من react-icons (تقدر تغيرها حسب اللينكات)
import { FaTachometerAlt, FaUsers, FaUserPlus, FaImage, FaTags, FaGift, FaChalkboardTeacher, FaChartBar, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import { FaQrcode } from "react-icons/fa";

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

  // أضفت أيقونات لكل لينك
  const menuItems = [
    { to: "/admin/dashboard", label: t("dashboard"), icon: <FaTachometerAlt /> },
    { to: "/admin/users", label: t("users"), icon: <FaUsers /> },
    { to: "/admin/subscribers", label: t("subscribers"), icon: <FaUserPlus /> },
    { to: "/admin/banners", label: t("banners"), icon: <FaImage /> },
    { to: "/admin/categories", label: t("categories"), icon: <FaTags /> },
    { to: "/admin/offers", label: t("offers"), icon: <FaGift /> },
    { to: "/admin/training-sessions", label: t("trainingSessions"), icon: <FaChalkboardTeacher /> },
    { to: "/admin/reports/subscribers", label: t("subscribersReport"), icon: <FaChartBar /> },
    { to: "/admin/reports/attendance", label: t("attendanceReport"), icon: <FaClipboardList /> },
    { to: "/admin/create-admin", label: t("createAdmin"), icon: <FaUserPlus /> },
    { to: "/admin/qr-dashboard", label: t("QR"), icon: <FaQrcode /> }
  ];

  return (
    <>
      {/* Hamburger button for mobile */}
      {isMobile && (
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="fixed top-4 left-4 z-[9999] p-3 rounded-xl bg-green-600 text-white shadow-lg 
          hover:bg-green-700 active:scale-95 transition"
          aria-label={isOpen ? "Close menu" : "Open menu"}
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
          flex flex-col justify-between z-50 border-r border-gray-300
          transition-transform duration-300 w-64
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
          overflow-y-auto max-h-screen
        `}
      >
        <div>
          {/* Admin Panel title + language toggle */}
          <div className="mb-8 flex flex-col items-start">
            <h2 className="text-3xl font-extrabold text-green-700 select-none mb-3 tracking-wide">
              {t("adminPanel")}
            </h2>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm font-semibold hover:bg-gray-300 transition"
              aria-label="Toggle language"
            >
              {lang === "en" ? "AR" : "EN"}
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex flex-col space-y-3">
            {menuItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3 px-5 py-3 rounded-xl text-base font-semibold
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-green-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-green-100 hover:text-green-700"
                  }
                  ${isMobile ? "justify-center" : ""}
                  `
                }
                onClick={() => isMobile && setIsOpen(false)}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 text-white py-3 rounded-xl
            font-semibold shadow hover:bg-red-700 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <FaSignOutAlt className="text-lg" />
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
