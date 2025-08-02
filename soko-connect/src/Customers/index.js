import React, { useState, useEffect } from 'react';
import { useCustomers } from '../hooks/useFetchCustomer';
import './style.css';

const Customers = () => {
  const { customers, loading, error } = useCustomers();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 6;


  useEffect(() => {
    if (selectedCustomer) {
      const timer = setTimeout(() => setShowModal(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  const customersWithLoyalty = customers.map(customer => ({
    ...customer,
    is_loyal:
      typeof customer.is_loyal === 'boolean'
        ? customer.is_loyal
        : customer.paymentsPerWeek >= 5,
  }));

  const filteredCustomers = customersWithLoyalty.filter(
    (customer) =>
      customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone_number.includes(searchTerm)
  );

  const sortedCustomers = filteredCustomers.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage) || 1;

  const safeCurrentPage = currentPage > totalPages ? totalPages : currentPage;

  const paginatedCustomers = sortedCustomers.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}. Check console.</div>;

  return (
    <div className="customers-container">
      <div className="page-banner-customer">
        <h1>Customers</h1>
      </div>
      <div className="customers-content">
        <div className="search-customer left-align">
          <input
            type="text"
            placeholder="Search by name or phone number..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input-customer"
          />
        </div>
        {paginatedCustomers.length > 0 ? (
          <>
            <table className="customers-table no-bg">
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
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <img
                        src={customer.profile_picture}
                        alt="Profile"
                        className="profile-picture-circle"
                        onError={(e) => (e.target.src = '/fallback-image.png')}
                      />
                    </td>
                    <td>{customer.full_name}</td>
                    <td>{customer.phone_number}</td>
                    <td>{customer.address || 'N/A'}</td> 
                    <td>
                      <button onClick={() => setSelectedCustomer(customer)}>View</button>
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
          <div className="no-data">No customer data available.</div>
        )}

        {selectedCustomer && (
          <div
            className="modal-overlay"
            style={{ display: showModal ? 'block' : 'none' }}
            onClick={() => setSelectedCustomer(null)}
          >
            <div className="customer-details" onClick={(e) => e.stopPropagation()}>
              <h2>Customer Details</h2>
              <div className="customer-details-flex">
                <img
                  src={selectedCustomer.profile_picture}
                  alt="Profile"
                  className="profile-picture-circle-modal"
                  onError={(e) => (e.target.src = '/fallback-image.png')}
                />
                <div className="customer-text-details">
                  <p><b>Full Name:</b> {selectedCustomer.full_name}</p>
                  <p><b>Phone Number:</b> {selectedCustomer.phone_number}</p>
                  <p><b>Address: </b>{selectedCustomer.address || 'N/A'}</p>
                  <p><b>Joined: </b>{new Date(selectedCustomer.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
