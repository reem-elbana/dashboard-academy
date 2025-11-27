import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);

  const { token, userRole, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const switchLang = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  useEffect(() => {
    const saved = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(saved);
    document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
  }, [i18n]);

  // جلب التنبيهات
  useEffect(() => {
    if (!token) return;
    axios
      .get("https://generous-optimism-production-4492.up.railway.app/api/subscriber/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const apiNotifications = res.data.data.recommendations || [];
        setNotifications(apiNotifications.map(n => ({
          title: n.title || "Notification",
          message: n.message || "",
          priority: n.priority || "medium"
        })));
        // تحقق من وجود أي تنبيهات جديدة ذات أولوية عالية
        setHasNew(apiNotifications.some(n => n.priority === "high"));
      })
      .catch((err) => console.error(err));
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOpenNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (hasNew) setHasNew(false); // إزالة النقطة الحمراء عند فتح التنبيهات
  };

  return (
    <header className="bg-white shadow-md fixed inset-x-0 top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3 flex items-center justify-between">
        <p className="text-green-600 font-extrabold text-2xl">ALforsan Academy</p>

        {/* Desktop Links */}
        <div className="hidden lg:flex lg:items-center lg:space-x-8">
          {token && userRole === "subscriber" && (
            <>
              <NavLink to="/user/home" className="text-gray-700 hover:text-lime-600 font-medium transition">{t("home")}</NavLink>
              <NavLink to="/user/profile" className="text-gray-700 hover:text-lime-600 font-medium transition">{t("profile")}</NavLink>
              <NavLink to="/user/offers" className="text-gray-700 hover:text-lime-600 font-medium transition">{t("My Sessions & Offers")}</NavLink>
              <NavLink to="/user/sports" className="text-gray-700 hover:text-lime-600 font-medium transition">{t("sports")}</NavLink>
            </>
          )}
        </div>

        {/* Right Side: Notifications + Language + Logout */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button onClick={handleOpenNotifications} className="relative p-2.5 rounded-full hover:bg-gray-100 transition">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-12 0v3.158c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {hasNew && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-bold text-gray-900">{t("notifications")}</h3>
                  <p className="text-xs text-gray-500 mt-1">{notifications.length} new</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? notifications.map((notif, i) => (
                    <div key={i} className={`p-4 border-b hover:bg-gray-50 transition ${notif.priority === "high" ? "bg-red-50" : notif.priority === "medium" ? "bg-amber-50" : "bg-green-50"}`}>
                      <p className="font-semibold text-gray-900">{notif.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    
                    </div>
                  )) : (
                    <div className="p-12 text-center text-gray-500">{t("no_notifications")}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Language */}
          <button onClick={switchLang} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            {i18n.language === "en" ? "عربي" : "EN"}
          </button>

          {/* Logout */}
          {token && (
            <button onClick={handleLogout} className="text-red-600 font-medium hover:text-red-700 transition">{t("logout")}</button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center gap-3">
          {/* Notifications Mobile */}
          <button onClick={handleOpenNotifications} className="relative p-2 rounded-full hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-12 0v3.158c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {hasNew && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Hamburger */}
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Links */}
      {isOpen && (
    <div className="lg:hidden bg-white shadow-md px-4 py-3 space-y-2">
      <button onClick={switchLang} className="px-2 py-1 border rounded text-xs block">{i18n.language === "en" ? "AR" : "EN"}</button>

      {token && userRole === "subscriber" && (
        <>
          <NavLink to="/user/home" onClick={() => setIsOpen(false)} className="block py-1 text-gray-700 hover:text-lime-600 text-sm">{t("home")}</NavLink>
          <NavLink to="/user/profile" onClick={() => setIsOpen(false)} className="block py-1 text-gray-700 hover:text-lime-600 text-sm">{t("profile")}</NavLink>
          <NavLink to="/user/offers" onClick={() => setIsOpen(false)} className="block py-1 text-gray-700 hover:text-lime-600 text-sm">{t("My Sessions & Offers")}</NavLink>
          <NavLink to="/user/sports" onClick={() => setIsOpen(false)} className="block py-1 text-gray-700 hover:text-lime-600 text-sm">{t("sports")}</NavLink>
        </>
      )}

      {token && <button onClick={handleLogout} className="block w-full text-red-600 font-medium py-1 text-sm">{t("logout")}</button>}
    </div>
  )}
      {/* Mobile Notifications Dropdown */}
      {notificationsOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-white shadow-2xl border-t z-40 max-h-screen overflow-y-auto">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-bold">{t("notifications")}</h3>
            <p className="text-xs text-gray-500 mt-1">{notifications.length} new</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? notifications.map((notif, i) => (
              <div key={i} className={`p-4 border-b hover:bg-gray-50 transition ${notif.priority === "high" ? "bg-red-50" : notif.priority === "medium" ? "bg-amber-50" : "bg-green-50"}`}>
                <p className="font-semibold text-gray-900">{notif.title}</p>
                <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                
              </div>
            )) : (
              <div className="p-12 text-center text-gray-500">{t("no_notifications")}</div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
