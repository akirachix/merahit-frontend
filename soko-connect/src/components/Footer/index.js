import React from "react";
import "./style.css";

function Footer() {
  return (
    <footer className="admin-footer">
      <span>&copy; {new Date().getFullYear()} Soko Connect | Admin Dashboard</span>
    </footer>
  );
}

export default Footer;
