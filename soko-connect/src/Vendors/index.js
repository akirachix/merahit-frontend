import React, { useState, useEffect } from 'react';
import { useVendors } from '../hooks/useFetchVendor/index';
import './style.css';

const Vendors = () => {
  const { vendors = [], loading, error } = useVendors();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 8; 

  useEffect(() => {
    if (selectedVendor) {
      const timer = setTimeout(() => setShowModal(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [selectedVendor]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.phone_number.includes(searchTerm)
  );

  const sortedVendors = filteredVendors.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const totalPages = Math.max(1, Math.ceil(sortedVendors.length / itemsPerPage));
  const safeCurrentPage = currentPage > totalPages ? totalPages : currentPage;

  const paginatedVendors = sortedVendors.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}. Check console.</div>;

  return (
    <div className="vendors-container">
      <div className="page-banner">
        <h1>Vendors</h1>
      </div>
      <div className="vendors-content">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or phone number..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {paginatedVendors.length > 0 ? (
          <>
            <table className="vendors-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Full Name</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td>
                      <img
                        src={vendor.profile_picture}
                        alt="Profile"
                        className="profile-picture-circle"
                        onError={(e) => (e.target.src = '/fallback-image.png')}
                      />
                    </td>
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
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
              >
                Previous
              </button>

              <span className="current-page">
                Page {safeCurrentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="no-data">No vendor data available.</div>
        )}

        {selectedVendor && (
          <div
            className="modal-overlay"
            style={{ display: showModal ? 'flex' : 'none' }}
            onClick={() => setSelectedVendor(null)}
          >
            <div className="vendor-details" onClick={(e) => e.stopPropagation()}>
              <h2>Vendor Details</h2>
              <div className="customer-details-flex">
                <img
                  src={selectedVendor.profile_picture}
                  alt="Profile"
                  className="profile-picture-circle-modal"
                  onError={(e) => (e.target.src = '/fallback-image.png')}
                />
                <div className="customer-text-details">
                  <p><b>Full Name: </b>{selectedVendor.full_name}</p>
                  <p><b>Phone Number:</b> {selectedVendor.phone_number}</p>
                  <p><b>Address:</b> {selectedVendor.address || 'N/A'}</p>
                  <p><b>User Type:</b> {selectedVendor.usertype}</p>
                  <p><b>Joined: </b>{new Date(selectedVendor.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={() => setSelectedVendor(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendors;
