import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDiscounts } from "../hooks/usefetchdiscounts/index";
import "./style.css";


const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const DiscountsIndex = () => {
  const { discounts, loading, error } = useDiscounts();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setSelectedDiscount(null);
    setShowModal(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!discounts) return;

    const term = searchTerm.toLowerCase();

    const filtered = discounts
      .filter((d) => {
        const productName = d.product?.product_name || "";
        const vendorName = d.vendor?.full_name || "";
        return (
          productName.toLowerCase().includes(term) ||
          vendorName.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

    setFilteredDiscounts(filtered);
    setCurrentPage(1);
  }, [discounts, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredDiscounts.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedDiscounts = filteredDiscounts.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleViewDetails = (discount) => {
    setSelectedDiscount(discount);
    setShowModal(true);
  };

  if (loading) return <div className="discounts-loading">Loading...</div>;
  if (error) return <div className="discounts-error">Error: {error}. Check console.</div>;

  return (
    <div className="discounts-wrapper">
      <div className="discounts-header-banner">
        <p>Manage discount offers and promotions</p>
      </div>

      <div className="discounts-search-container">
        <input
          type="text"
          placeholder="Search by product or vendor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="discounts-search-input"
          autoComplete="off"
        />
      </div>

      <div className="discounts-content-area">
        {paginatedDiscounts.length > 0 ? (
          <>
            <table className="discounts-main-table">
              <thead>
                <tr>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Vendor</th>
                  <th>Old Price</th>
                  <th>New Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDiscounts.map((discount) => (
                  <tr key={discount.id}>
                    <td>
                      {discount.product?.product_image ? (
                        <img
                          src={discount.product.product_image}
                          alt={capitalizeFirstLetter(discount.product.product_name)}
                          className="discounts-product-image-thumb"
                          onError={(e) => (e.target.src = "/fallback-image.png")}
                        />
                      ) : (
                        <div
                          className="discounts-product-image-thumb"
                          style={{ backgroundColor: "#ccc" }}
                        />
                      )}
                    </td>
                    <td>{capitalizeFirstLetter(discount.product.product_name)}</td>
                    <td>{discount.vendor.full_name}</td>
                    <td>KSH {discount.old_price ?? "N/A"}</td>
                    <td>KSH {discount.new_price ?? "N/A"}</td>
                    <td>
                      <button
                        className="discounts-view-button"
                        onClick={() => handleViewDetails(discount)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="discounts-pagination">
              <button
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                className="discounts-page-button"
              >
                Previous
              </button>

              <span className="discounts-page-number">
                Page {safeCurrentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                className="discounts-page-button"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="discounts-no-data">No discount data available.</div>
        )}

        {selectedDiscount && (
          <div
            className="discounts-modal-overlay"
            style={{ display: showModal ? "flex" : "none" }}
            onClick={() => setSelectedDiscount(null)}
          >
            <div
              className="discounts-modal-details"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Discount Details</h2>
              <div className="discounts-modal-content-flex" style={{ justifyContent: "center" }}>
                <img
                  src={
                    selectedDiscount.product?.product_image || "/fallback-image.png"
                  }
                  alt={
                    capitalizeFirstLetter(selectedDiscount.product?.product_name) || "Product Image"
                  }
                  className="discounts-modal-product-image-circle"
                  onError={(e) => (e.target.src = "/fallback-image.png")}
                />

                <div className="discounts-modal-product-info">
                  <p>
                    <strong>Product:</strong>{" "}
                    {capitalizeFirstLetter(selectedDiscount.product?.product_name) || "N/A"}
                  </p>
                  <p>
                    <strong>Stock Unit:</strong>{" "}
                    {capitalizeFirstLetter(selectedDiscount.product?.stock_unit) || "N/A"}
                  </p>
                  <p><strong>Vendor:</strong> {selectedDiscount.vendor?.full_name || "N/A"}</p>
                  <p><strong>Old Price:</strong> KSH {selectedDiscount.old_price ?? "N/A"}</p>
                  <p><strong>New Price:</strong> KSH {selectedDiscount.new_price ?? "N/A"}</p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {selectedDiscount.start_date
                      ? new Date(selectedDiscount.start_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {selectedDiscount.end_date
                      ? new Date(selectedDiscount.end_date).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <button
                    className="discounts-close-button"
                    onClick={() => setSelectedDiscount(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountsIndex;