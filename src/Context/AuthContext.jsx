import React, { createContext, useState, useEffect } from "react";

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

  const logout = () => {
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
