import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
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
        <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
      </button>
      <div className={`header-content ${sidebarOpen ? "shifted" : ""}`}>
        <span className="header-title">Soko Connect Admin Dashboard</span>
        <div style={{ flex: 1 }} />
        <img
          src="Images/sokoconnectlogo-removebg-preview.png"
          className="header-user"
          alt="Logo"
        />
      </div>
    </header>
  );
}

export default Header;