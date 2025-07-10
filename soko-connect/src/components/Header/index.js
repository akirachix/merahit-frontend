import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons"; // Hamburger icon
import "./style.css";

function Header({ onSidebarToggle, sidebarOpen }) {
  return (
    <header className="admin-header">
      {!sidebarOpen && (
        <button className="header-hamburger" onClick={onSidebarToggle}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}
      <span className="header-title">Soko Connect Admin Dashboard</span>
      <div style={{ flex: 1 }} />
      <img src="Images/sokoconnectlogo-removebg-preview.png" className="header-user" alt="Logo" />
    </header>
  );
}

export default Header;