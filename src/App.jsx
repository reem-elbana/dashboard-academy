import AppRoutes from "../src/components/AppRoutes/AppRoutes.jsx";
import { AuthProvider } from "../src/Context/AuthContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
