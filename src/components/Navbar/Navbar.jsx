import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../Context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md fixed inset-x-0 top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3 flex items-center justify-between">

        <p className="text-lime-600 font-medium">ALforsan Academy</p>

        {/* Desktop Links */}
        <div className="hidden lg:flex lg:items-center lg:space-x-8 rtl:space-x-reverse">

          {token && (
            <>
              <NavLink to={"home"} className="text-gray-800 hover:text-blue-600 font-medium transition">{t("home")}</NavLink>
              <NavLink to={"about"} className="text-gray-800 hover:text-blue-600 font-medium transition">{t("about")}</NavLink>
            </>
          )}
        </div>

        {/* Right section */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6 rtl:space-x-reverse">

          {/* Language Switcher */}
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="border border-gray-300 rounded px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>

          {/* Auth Links */}
          {!token ? (
            <>

              <NavLink
                to={"/login"}
                className="text-gray-800 hover:text-blue-600 font-medium transition"
              >
                {t("login")} →
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-600 font-medium hover:text-red-700 transition"
            >
              Logout
            </button>
          )}

        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={isOpen ? "lg:hidden" : "hidden"} role="dialog" aria-modal="true">
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/20 z-40" />

        <div className="fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-lg px-6 py-6 overflow-y-auto">

          <div className="flex items-center justify-between mb-6">
            <p className="text-lime-600 font-medium">ALforsan Academy</p>
            <button onClick={() => setIsOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col space-y-4 mb-6">
            {token && (
              <>
                <NavLink to={"home"} onClick={() => setIsOpen(false)} className="text-gray-800 hover:text-blue-600 font-medium transition">{t("home")}</NavLink>
                <NavLink to={"about"} onClick={() => setIsOpen(false)} className="text-gray-800 hover:text-blue-600 font-medium transition">{t("about")}</NavLink>
              </>
            )}
          </div>

          {/* Language Switcher */}
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="border border-gray-300 rounded px-3 py-1 text-gray-700 w-11/12 mb-6"
          >
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>

          {/* Auth Links */}
          <div className="flex flex-col space-y-3">
            {!token ? (
              <>
                <NavLink to={"/login"} onClick={() => setIsOpen(false)} className="text-gray-800 hover:text-blue-600 font-medium transition">{t("login")} →</NavLink>
              </>
            ) : (
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="text-red-600 font-medium hover:text-red-700 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}