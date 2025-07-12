import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CloseIcon from "@mui/icons-material/Close";
import "./style.css";

const sideNav = [
  { key: "dashboard", label: "Dashboard", icon: <BarChartIcon /> },
  { key: "customers", label: "Customers", icon: <PersonIcon /> },
  { key: "vendors", label: "Vendors", icon: <BusinessIcon /> },
  { key: "products", label: "Products", icon: <InventoryIcon /> },
  { key: "orders", label: "Orders", icon: <ReceiptIcon /> },
  { key: "reviews", label: "Reviews", icon: <StarIcon /> },
  { key: "discounts", label: "Discounts", icon: <LocalOfferIcon /> },
];

const Sidebar = React.forwardRef(({ open, setSidebarOpen }, ref) => {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".header-hamburger")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setSidebarOpen]);

  const handleNav = (nav) => {
    navigate(nav);
  };

  return (
    <nav ref={ref} className={`sidebar ${open ? "open" : "closed"}`} id="sidebar">
      <div className="sidebar-header">
        <CloseIcon
          className="sidebar-close-icon"
          onClick={() => setSidebarOpen(false)}
        />
      </div>
      {open && (
        <ul>
          {sideNav.map((item) => (
            <li
              key={item.key}
              className={
                window.location.pathname.split("/").pop() === item.key ? "active" : ""
              }
              onClick={() => handleNav(`/dashboard/${item.key}`)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
});

export default Sidebar;