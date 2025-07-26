import React from "react";
import { useNavigate } from "react-router-dom";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
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
  const handleNav = (nav) => {
    navigate(`/${nav}`);
  };
  return (
    <nav ref={ref} className={`sidebar ${open ? "open" : "closed"}`} id="sidebar">
      <div className="sidebar-header">
        <img
          src="/Images/sokoconnectlogo-removebg-preview.png"
          className="sidebar-logo"
          alt="Soko Connect Logo"
        />
      </div>
      <ul>
        {sideNav.map((item) => (
          <li
            key={item.key}
            className={
              window.location.pathname.split("/").pop() === item.key ? "active" : ""
            }
            onClick={() => handleNav(item.key)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
});

export default Sidebar;