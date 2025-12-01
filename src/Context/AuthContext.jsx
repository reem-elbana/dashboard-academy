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
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");

  const saveToken = (tkn, role) => {
    setToken(tkn);
    setUserRole(role);
    localStorage.setItem("token", tkn);
    localStorage.setItem("role", role);
  };

  const logout = async () => {
    if (token) {
      try {
        // استدعاء الـ logout API
        await axios.post(
          "https://generous-optimism-production-4492.up.railway.app/api/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Logout API failed:", err);
      }
    }

    // مسح التوكن والدور من الـ state والـ localStorage
    setToken("");
    setUserRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ token, userRole, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
