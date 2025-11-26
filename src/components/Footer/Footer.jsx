import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-10 py-6">
      <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
        © {new Date().getFullYear()} ALforsan Academy. All rights reserved.
      </div>
    </footer>
  );
}
