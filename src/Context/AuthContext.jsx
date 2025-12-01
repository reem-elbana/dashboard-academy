// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");

//   const saveToken = (tkn, role) => {
//     setToken(tkn);
//     setUserRole(role);
//     localStorage.setItem("token", tkn);
//     localStorage.setItem("role", role);
//   };

//   const logout = () => {
//     setToken("");
//     setUserRole("");
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//   };

//   return (
//     <AuthContext.Provider value={{ token, userRole, saveToken, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// 


import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");
  const [permissions, setPermissions] = useState([]);

  const saveToken = async (tkn, role) => {
    setToken(tkn);
    setUserRole(role);
    localStorage.setItem("token", tkn);
    localStorage.setItem("role", role);

    // جلب الصلاحيات بعد تسجيل الدخول
    try {
      const { data } = await axios.get(
        "https://generous-optimism-production-4492.up.railway.app/api/admin/my-permissions",
        { headers: { Authorization: `Bearer ${tkn}` } }
      );

      if (data.success && data.data.permissions) {
        // خزن أسماء الصلاحيات بس عشان تستخدمها بسهولة
        const perms = data.data.permissions.map((p) => p.name);
        setPermissions(perms);
      }
    } catch (err) {
      console.error("Failed to load permissions:", err);
      setPermissions([]);
    }
  };

  const logout = async () => {
    // ... كود logout اللي عندك
  };

  return (
    <AuthContext.Provider value={{ token, userRole, permissions, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

