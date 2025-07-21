import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./style.css";

function Header({ sidebarOpen, setSidebarOpen }) {
  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <header className="admin-header">
      <button
        className="header-hamburger"
        onClick={handleSidebarToggle}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={sidebarOpen}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className="header-content">
        <span className="header-title">Soko Connect Admin Dashboard</span>
      </div>
    </header>
  );
}

export default Header;