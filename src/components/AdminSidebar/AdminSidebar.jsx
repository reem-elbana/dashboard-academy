import React from "react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg p-6 h-screen fixed">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-4">
        <NavLink to="/admin/dashboard" className={({isActive})=>isActive?"font-bold text-green-600":"hover:text-green-600"}>Dashboard</NavLink>
        <NavLink to="/admin/users" className={({isActive})=>isActive?"font-bold text-green-600":"hover:text-green-600"}>Users</NavLink>
        <NavLink to="/admin/manage" className={({isActive})=>isActive?"font-bold text-green-600":"hover:text-green-600"}>Manage Content</NavLink>
      </nav>
    </aside>
  );
}
