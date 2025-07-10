import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header/index";
import Sidebar from "./components/Sidebar/index";
import Footer from "./components/Footer/index";
import LoginPage from "./components/Login/index";
import "./App.css";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('.hamburger-icon')
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  const handleNav = (nav) => {
    navigate(nav);
  };
  return (
    <div className="admin-dashboard-app">
      <Header onSidebarToggle={handleSidebarToggle} sidebarOpen={sidebarOpen} />
      <div className="main-area">
        <Sidebar
          ref={sidebarRef}
          open={sidebarOpen}
          active={window.location.pathname.split("/").pop() || "dashboard"}
          onNav={handleNav}
          toggleSidebar={handleSidebarToggle}
        />
      </div>
      <Footer />
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}
export default App;