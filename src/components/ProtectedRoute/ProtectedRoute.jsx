import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { token, userRole } = useContext(AuthContext);

  if (!token) {
    // مش مسجل دخول → تحويل للـ login
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    // مسجل دخول لكن مش نفس الـ role → منع الوصول
    return <Navigate to="/login" replace />;
  }

  return children;
}
