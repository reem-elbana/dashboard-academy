// }
// import React, { useContext } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../../Context/AuthContext";

// export default function ProtectedRoute({ role, children }) {
//   const { token, userRole } = useContext(AuthContext);
//   const location = useLocation();  // ناخد الصفحة اللي المستخدم حاول يدخلها

//   // Allow access to profile page if QR login params are present
//   const urlParams = new URLSearchParams(location.search);
//   const isQrLogin = urlParams.get('token') && urlParams.get('login') === 'qr';

//   if (!token && !isQrLogin) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   const currentRole = userRole?.toLowerCase();

//   if (role && !isQrLogin) {
//     const allowedRoles = Array.isArray(role)
//       ? role.map((r) => r.toLowerCase())
//       : [role.toLowerCase()];

//     if (!allowedRoles.includes(currentRole)) {
//       return <Navigate to="/login" replace state={{ from: location }} />;
//     }
//   }

//   return children;
// }

import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { token, userRole } = useContext(AuthContext);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role) {
    const allowedRoles = Array.isArray(role)
      ? role.map(r => r.toLowerCase())
      : [role.toLowerCase()];

    const currentRole = userRole?.toLowerCase();

    if (!currentRole || !allowedRoles.includes(currentRole)) {
      return <Navigate to="/login" replace />;
    }
  }

  // 3️⃣ مسموح بالدخول
  return children;
}
