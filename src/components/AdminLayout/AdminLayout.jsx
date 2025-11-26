import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar.jsx";

export default function AdminLayout() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6 ml-64 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
