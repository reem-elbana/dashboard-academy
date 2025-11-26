import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../src/Context/AuthContext";
import AppRoutes from "../src/components/AppRoutes/AppRoutes.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
