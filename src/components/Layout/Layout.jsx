// import React from "react";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
// import { Outlet } from "react-router-dom";

// export default function Layout() {
//   return (
//     <div>
//       <Navbar />
//       <div className="pt-20 px-6"> {/* pt-20 عشان Navbar fixed */}
//         <Outlet />
//       </div>
//       <Footer />
//     </div>
//   );
// }

import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";

export default function Layout({ showNavbar = true }) {
  return (
    <div>
      {/* لو showNavbar true، نعرض Navbar */}
      {showNavbar && <Navbar />}
      
      <div className="pt-20 px-6"> {/* pt-20 عشان Navbar fixed */}
        <Outlet />
      </div>
      
      <Footer />
    </div>
  );
}