

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import LoginPage from './Login';
import Header from "./shared-components/Header/index";
import Sidebar from "./shared-components/Sidebar/index";
import ProductsIndex from "./Products";
import DiscountsIndex from "./Discounts";
import Reviews from "./Reviews/index";
import Orders from "./Orders/index";
import Customers from "./Customers";
import Vendors from "./Vendors";

import "./App.css";


function App() {
<<<<<<< HEAD
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <div className="admin-dashboard-app">
              <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <div className={`main-area ${sidebarOpen ? 'shifted' : ''}`}>
                <Sidebar open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/vendors" element={<Vendors />} />
                    <Route path="/products" element={<ProductsIndex />} />
                    <Route path="/discounts" element={<DiscountsIndex />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
=======
 const [sidebarOpen, setSidebarOpen] = useState(true);


 const ProtectedRoute = ({ children }) => {
   const isAuthenticated = Boolean(localStorage.getItem('access_token'));
   if (!isAuthenticated) {
     return <Navigate to="/login" replace />;
   }
   return children;
 };


 return (
   <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
     <Routes>
       <Route path="/" element={<Navigate to="/login" replace />} />
       <Route path="/login" element={<LoginPage />} />
       <Route
         path="/*"
         element={
           <ProtectedRoute>
             <div className="admin-dashboard-app">
               <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
               <div className={`main-area ${sidebarOpen ? 'shifted' : ''}`}>
                 <Sidebar open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                 <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                   <Routes>
                     <Route path="/dashboard" element={<Dashboard />} />
                     <Route path="/reviews" element={<Reviews />} />
                     <Route path="/orders" element={<Orders />} />
                     <Route path="/customers" element={<Customers />} />
                     <Route path="/vendors" element={<Vendors />} />
                   </Routes>
                 </main>
               </div>
             </div>
           </ProtectedRoute>
         }
       />
     </Routes>
   </Router>
 );
>>>>>>> 4254aca7ad02b67fa94d75a298086c4c69b2ddd0
}
export default App;