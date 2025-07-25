import React, { useState, useEffect } from "react";
import { useOrders } from "../hooks/useFetchOrders";
import "./style.css";

const Orders = () => {
  const { orders: allOrders, loading, error } = useOrders();

  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    if (selectedOrder) {
      const timer = setTimeout(() => setShowModal(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [selectedOrder]);

  const filteredOrders =
    filterStatus === "All"
      ? allOrders
      : allOrders.filter(
          (order) => order.status.toLowerCase() === filterStatus.toLowerCase()
        );

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / rowsPerPage));

  useEffect(() => setCurrentPage(1), [filterStatus]);
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}. Check console.</div>;

  return (
    <div className="orders-content">
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="status-filter" style={{ marginRight: 10, fontWeight: 600 }}>
          Filter by Status:
        </label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter orders by status"
          className="filter-select"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Picked Up">Picked Up</option>
          <option value="Completed">Completed</option>
          <option value="Processing">Processing</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {paginatedOrders.length > 0 ? (
        <>
          <table
            className="orders-table"
            role="table"
            aria-label="Orders table"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                <th>Customer</th>
                <th>Vendor</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rowsPerPage }).map((_, idx) => {
                const order = paginatedOrders[idx];
                return order ? (
                  <tr key={order.id} className="orders-table-row">
                    <td>{order.customer?.full_name || "-"}</td>
                    <td>{order.vendor?.full_name || "-"}</td>
                    <td>KES {order.total_amount}</td>
                    <td>{order.status}</td>
                    <td>
                      <button onClick={() => handleViewDetails(order)}>View</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={`empty-${idx}`} style={{ height: "50px" }}>
                    <td colSpan={5} />
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pagination" role="navigation" aria-label="Pagination Navigation">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous Page"
            >
              Previous
            </button>
            <div style={{ padding: "0 10px", alignSelf: "center", fontWeight: 600 }}>
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="no-data">No order data available for your filter.</div>
      )}

      {selectedOrder && showModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-details-title"
          onClick={() => setSelectedOrder(null)}
        >
          <div className="order-details" onClick={(e) => e.stopPropagation()}>
            <h2 id="order-details-title">Order Details</h2>
            <p>
              <span className="modal-label">Order ID:</span>{" "}
              <span className="modal-value">{selectedOrder.id}</span>
            </p>
            <p>
              <span className="modal-label">Customer:</span>{" "}
              <span className="modal-value">{selectedOrder.customer?.full_name || "-"}</span>
            </p>
            <p>
              <span className="modal-label">Mama Mboga:</span>{" "}
              <span className="modal-value">{selectedOrder.vendor?.full_name || "-"}</span>
            </p>
            <p>
              <span className="modal-label">Status:</span>{" "}
              <span className="modal-value">{selectedOrder.status}</span>
            </p>
            <p>
              <span className="modal-label">Total Amount:</span>{" "}
              <span className="modal-value">KES {selectedOrder.total_amount}</span>
            </p>
            <p>
              <span className="modal-label">Order Date:</span>{" "}
              <span className="modal-value">
                {new Date(selectedOrder.order_date).toLocaleDateString()}
              </span>
            </p>

            <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersIndex = () => (
  <div className="orders-container">
    <h1>Track and manage customer orders</h1>
    <Orders />
  </div>
);

export default OrdersIndex;


