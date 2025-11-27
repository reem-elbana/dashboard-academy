import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { token, userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const { i18n, t } = useTranslation();

  // تغيير اللغة
  const switchLang = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);

    // تغيير الاتجاه
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  // عند فتح الموقع — استخدم اللغة المحفوظة
  useEffect(() => {
    const saved = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(saved);
    document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
  }, [i18n]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md fixed inset-x-0 top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3 flex items-center justify-between">

        <p className="text-lime-600 font-bold text-xl">ALforsan Academy</p>
  {/* <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          {new Date(stats?.subscription_expires_at).toLocaleDateString("en-GB")}
        </span>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-600">
          <img src={user?.profile_image || "/default-profile.png"} alt="user" className="w-full h-full object-cover" />
        </div>
      </div> */}
        {/* Desktop Links */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          {token && userRole === "subscriber" && (
            <>
              <NavLink to="/user/home" className="hover:text-green-600">{t("home")}</NavLink>
              <NavLink to="/user/profile" className="hover:text-green-600">{t("profile")}</NavLink>
              <NavLink to="/user/offers" className="hover:text-green-600">{t("My Sessions & Offers")}</NavLink>
              <NavLink to="/user/sports" className="hover:text-green-600">{t("sports")}</NavLink>
            </>
          )}
        </div>

        {/* Language + Auth */}
        <div className="hidden lg:flex lg:items-center lg:space-x-4">

          {/* زر اللغة */}
          <button
            onClick={switchLang}
            className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
          >
            {i18n.language === "en" ? "AR" : "EN"}
          </button>

          {token ? (
            <button
              onClick={handleLogout}
              className="text-red-600 font-medium hover:text-red-700 transition"
            >
              {t("logout")}
            </button>
          ) : (
            <NavLink to="/login" className="text-green-600 font-medium hover:text-green-700">
              {t("login")}
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
          {/* زر اللغة في الموبايل */}
          <button
            onClick={switchLang}
            className="px-2 py-1 border rounded text-sm block"
          >
            {i18n.language === "en" ? "AR" : "EN"}
          </button>

          {token && userRole === "subscriber" && (
            <>
              <NavLink to="/user/home" onClick={() => setIsOpen(false)}>{t("home")}</NavLink>
              <NavLink to="/user/profile" onClick={() => setIsOpen(false)}>{t("profile")}</NavLink>
              <NavLink to="/user/offers" onClick={() => setIsOpen(false)}>{t("offers")}</NavLink>
              <NavLink to="/user/sports" onClick={() => setIsOpen(false)}>{t("sports")}</NavLink>
            </>
          )}

          {token ? (
            <button onClick={handleLogout} className="text-red-600 font-medium">
              {t("logout")}
            </button>
          ) : (
            <NavLink to="/login" onClick={() => setIsOpen(false)}>
              {t("login")}
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}