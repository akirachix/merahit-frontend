import React from "react";
import "./style.css";

function Footer({ sidebarOpen }) {
  return (
    <footer className="admin-footer">
      <div className={`footer-content ${sidebarOpen ? "shifted" : ""}`}>
        <span>© {new Date().getFullYear()} Soko Connect | Admin Dashboard</span>
      </div>
    </footer>
  );
}

export default Footer;