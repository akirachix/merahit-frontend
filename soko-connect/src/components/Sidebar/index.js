import React from "react";
import "./style.css";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from '@mui/icons-material/Business'; 
import InventoryIcon from '@mui/icons-material/Inventory'; 
import ReceiptIcon from '@mui/icons-material/Receipt'; 
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const sideNav = [
  { key: "dashboard", label: "Dashboard", icon: <BarChartIcon /> },
  { key: "customers", label: "Customers", icon: <PersonIcon /> },
   { key: "vendors", label: "Vendors", icon: <BusinessIcon /> },
  { key: "products", label: "Products", icon: <InventoryIcon /> },
  { key: "orders", label: "Orders", icon: <ReceiptIcon /> },
  { key: "reviews", label: "Reviews", icon: <StarIcon /> },
  { key: "discounts", label: "Discounts", icon: <LocalOfferIcon /> },
];

const Sidebar = React.forwardRef(({ open, active, onNav, toggleSidebar }, ref) => {
  return (
    <nav ref={ref} className={`sidebar ${open ? "open" : "closed"}`}>
      {open && (
        <>
          <ul>
            {sideNav.map((item) => (
              <li
                key={item.key}
                className={active === item.key ? "active" : ""}
                onClick={() => onNav(`/dashboard/${item.key}`)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </nav>
  );
});
export default Sidebar;