// import React from "react";
// import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "../src/Context/AuthContext";
// import AppRoutes from "../src/components/AppRoutes/AppRoutes.jsx";

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }


import React, { useContext, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../src/Context/AuthContext";
import AppRoutes from "../src/components/AppRoutes/AppRoutes.jsx";
import { LoadingProvider, LoadingContext } from "../src/Context/LoadingContext.jsx";
import GlobalSkeleton from "../src/components/GlobalSkeleton/GlobalSkeleton.jsx";

function AppContent() {
  const { loading, setLoading } = useContext(LoadingContext);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <>
      {loading && <GlobalSkeleton />}
      {!loading && <AppRoutes />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </LoadingProvider>
    </AuthProvider>
  );
}
