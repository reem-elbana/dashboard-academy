import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar.jsx";

export default function AdminLayout() {
return (
  <div className="flex min-h-screen ">
    <AdminSidebar />

    <main
      className="
        flex-1 
        pl-0 md:pl-64 
        transition-all 
        p-4 sm:p-6 md:p-8 
        mt-14 md:mt-0
      "
    >
      <div className="max-w-6xl mx-auto">
        <Outlet />
      </div>
    </main>
  </div>
);
}
