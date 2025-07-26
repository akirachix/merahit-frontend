import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./shared-components/Header/index";
import Sidebar from "./shared-components/Sidebar/index";
import ProductsIndex from "./Products";
import DiscountsIndex from "./Discounts";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="admin-dashboard-app">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className={`main-area ${sidebarOpen ? "shifted" : ""}`}>
          <Sidebar open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
            <Routes>
              <Route path="/products" element={<ProductsIndex />} />
              <Route path="/discounts" element={<DiscountsIndex />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./shared-components/Header/index";
// import Sidebar from "./shared-components/Sidebar/index";
// import "./App.css";

// function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
//       <Routes>
//         <Route
//           path="/*"
//           element={
//             <div className="admin-dashboard-app">
//               <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//               <div className={`main-area ${sidebarOpen ? "shifted" : ""}`}>
//                 <Sidebar open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//               </div>
//             </div>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;