import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar.jsx";
import { useTranslation } from "react-i18next";

export default function AdminLayout() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className="flex min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar */}
      <div className={isRTL ? "order-2" : "order-1"}>
        <AdminSidebar />
      </div>

      {/* Content */}
      <main
        className={`
          flex-1 
          transition-all 
          p-4 sm:p-6 md:p-8 
          mt-14 md:mt-0
          ${isRTL ? "pr-0 md:pr-64" : "pl-0 md:pl-64"}
          ${isRTL ? "order-1" : "order-2"}
        `}
      >
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
