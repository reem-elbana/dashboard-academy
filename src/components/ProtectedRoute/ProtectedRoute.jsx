// ProtectedRoute.jsx

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { token, userRole } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = userRole?.toLowerCase();

  if (role) {
    const allowedRoles = Array.isArray(role)
      ? role.map((r) => r.toLowerCase())
      : [role.toLowerCase()];

    if (!allowedRoles.includes(currentRole)) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}