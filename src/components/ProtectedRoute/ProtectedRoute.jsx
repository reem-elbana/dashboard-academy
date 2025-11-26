import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  // لو مش لوجيد
  if (!user) return <Navigate to="/login" replace />;

  // لو اليوزر نوعه مش نفس الدور المطلوب
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
}
