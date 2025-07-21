import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./shared-components/Header/index";
import Sidebar from "./shared-components/Sidebar/index";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route
          path="/*"
          element={
            <div className="admin-dashboard-app">
              <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <div className={`main-area ${sidebarOpen ? "shifted" : ""}`}>
                <Sidebar open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;