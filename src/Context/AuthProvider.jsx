
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { AuthContext } from "./AuthContext";

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");
//   const [permissions, setPermissions] = useState([]);

//   // -------- 1) Load permissions on page refresh --------
// useEffect(() => {
//   if (!token) return;

//   const loadPermissions = async () => {
//     try {
//       const { data } = await axios.get(
//         "https://generous-optimism-production-4492.up.railway.app/api/admin/my-permissions",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (data.success) {
//         setPermissions(data.data.permissions.map(p => p.name));
//       }
//     } catch (err) {
//       setPermissions([]);
//     }
//   };

//   loadPermissions();
// }, [token]);


//   // -------- 2) Called after login --------
//   const saveToken = async (tkn, role) => {
//     setToken(tkn);
//     setUserRole(role);
//     localStorage.setItem("token", tkn);
//     localStorage.setItem("role", role);
//     fetchPermissions(tkn);
//   };

//   const logout = () => {
//     setToken("");
//     setUserRole("");
//     setPermissions([]);
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//   };

//   return (
//     <AuthContext.Provider value={{ token, userRole, permissions, saveToken, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (!token) return;

    const loadPermissions = async () => {
      try {
        const { data } = await axios.get(
          "https://generous-optimism-production-4492.up.railway.app/api/admin/my-permissions",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          setPermissions(data.data.my_permissions);
        }
      } catch (err) {
        setPermissions([]);
      }
    };

    loadPermissions();
  }, [token]);

  const saveToken = (tkn, role) => {
    setToken(tkn);
    setUserRole(role);
    localStorage.setItem("token", tkn);
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setToken("");
    setUserRole("");
    setPermissions([]);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{ token, userRole, permissions, saveToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
