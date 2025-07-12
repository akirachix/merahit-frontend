import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./shared-component/Header/index";
import Sidebar from "./shared-component/Sidebar/index";
import Footer from "./shared-component/Footer/index";
import LoginPage from "./Authentication/Login/index";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard/*"
          element={
            <div className="admin-dashboard-app">
              <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <div className="main-area">
                <Sidebar open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              </div>
              <Footer sidebarOpen={sidebarOpen} />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;