// components/GlobalSkeleton.jsx
import React from "react";

export default function GlobalSkeleton() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center space-y-4 z-50">
      <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-64 h-6 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}
