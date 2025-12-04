// components/GlobalSkeleton.jsx
import React from "react";
import logo from "../../assets/images/logo-Photoroom 3.png";

export default function GlobalSkeleton() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center space-y-4 z-50">
      <img src={logo} alt="Logo" className="w-32 h-32" />
      <h1 className="text-2xl font-bold text-gray-800">Al Forsan Talent Academy</h1>
      <p className="text-lg text-gray-600">من فضلك انتظر قليلًا…</p>
    </div>
  );
}
