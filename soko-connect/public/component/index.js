import React, { useState, useEffect } from "react";
import { useVendors } from "../../hooks/useVendor/index";
import "./style.css";
const Vendors = () => {
  const { vendors, totalPages, currentPage, setPage, loading, error } = useVendors();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  console.log("Vendors Data:", vendors, "Loading:", loading, "Error:", error);
  useEffect(() => {
    if (selectedVendor) {
      const timer = setTimeout(() => setShowModal(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [selectedVendor]);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}. Check console.</div>;
  return (
    <div className="vendors-content">
      {vendors.length > 0 ? (
        <>
          <table className="vendors-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>{vendor.id}</td>
                  <td>{vendor.full_name}</td>
                  <td>{vendor.phone_number}</td>
                  <td>{vendor.address}</td>
                  <td>
                    <button onClick={() => setSelectedVendor(vendor)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                onClick={() => handlePageChange(page + 1)}
                className={currentPage === page + 1 ? "active" : ""}
              >
                {page + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="no-data">No vendor data available.</div>
      )}
      {selectedVendor && (
        <div className="modal-overlay" style={{ display: showModal ? "block" : "none" }}>
          <div className="vendor-details" onClick={(e) => e.stopPropagation()}>
            <h2>Vendor Details</h2>
            <p>ID: {selectedVendor.id}</p>
            <p>Full Name: {selectedVendor.full_name}</p>
            <p>Phone Number: {selectedVendor.phone_number}</p>
            <p>Address: {selectedVendor.address}</p>
            <p>User Type: {selectedVendor.usertype}</p>
            <p>Joined: {new Date(selectedVendor.created_at).toLocaleDateString()}</p>
            <img
              src={selectedVendor.profile_picture}
              alt="Profile"
              className="profile-picture"
              onError={(e) => (e.target.src = "/fallback-image.png")}
            />
            <button onClick={() => setSelectedVendor(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Vendors;




















