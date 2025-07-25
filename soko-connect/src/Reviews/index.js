import React, { useState, useEffect, useMemo } from "react";
import { useReviews } from "../hooks/useFetchReviews/index";
import "./style.css";

const PAGE_SIZE = 9;

const ReviewsIndex = () => {
  const { reviews, loading, error } = useReviews();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(null); 

  const sortedReviews = useMemo(() => {
    let filtered = [...reviews];
    if (ratingFilter !== null) {
      filtered = filtered.filter((rev) => rev.rating === ratingFilter);
    }
    return filtered.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [reviews, ratingFilter]);

  const totalLocalPages = Math.ceil(sortedReviews.length / PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalLocalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalLocalPages]);

  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    if (selectedReview) {
      const timer = setTimeout(() => setShowModal(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [selectedReview]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalLocalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}. Check console.</div>;

  return (
    <div className="reviews-container">
      <h1>Customer Feedback and Ratings</h1>

      <div className="reviews-content">
        <div className="filter-container">
          <label htmlFor="ratingFilter">Filter by Rating:&nbsp;</label>
          <select
            id="ratingFilter"
            value={ratingFilter || ""}
            onChange={(e) => {
              const val = e.target.value;
              setRatingFilter(val === "" ? null : Number(val));
              setCurrentPage(1); 
            }}
          >
            <option value="">All</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {sortedReviews.length > 0 ? (
          <>
            <table className="reviews-table" role="table" aria-label="Reviews Table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReviews.map((review) => (
                  <tr key={review.id} className="reviews-table-row">
                    <td>{review.vendor.full_name}</td>
                    <td>{review.customer.full_name}</td>
                    <td>{review.rating}</td>
                    <td>
                      <button onClick={() => setSelectedReview(review)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination" role="navigation" aria-label="Pagination Navigation">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className="pagination-info">
                {currentPage} / {totalLocalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalLocalPages}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="no-data">No review data available.</div>
        )}

        {selectedReview && showModal && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedReview(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-details-title"
          >
            <div className="review-details" onClick={(e) => e.stopPropagation()}>
              <h2 id="review-details-title">Review Details</h2>
              <p>
                <span className="modal-label">ID:</span>{" "}
                <span className="modal-value">{selectedReview.id}</span>
              </p>
              <p>
                <span className="modal-label">Vendor:</span>{" "}
                <span className="modal-value">{selectedReview.vendor.full_name}</span>
              </p>
              <p>
                <span className="modal-label">Customer:</span>{" "}
                <span className="modal-value">{selectedReview.customer.full_name}</span>
              </p>
              <p>
                <span className="modal-label">Rating:</span>{" "}
                <span className="modal-value">{selectedReview.rating}</span>
              </p>
              <p>
                <span className="modal-label">Comment:</span>{" "}
                <span className="modal-value">{selectedReview.comment || "N/A"}</span>
              </p>
              <p>
                <span className="modal-label">Created:</span>{" "}
                <span className="modal-value">
                  {new Date(selectedReview.created_at).toLocaleDateString()}
                </span>
              </p>
              <button className="modal-close-btn" onClick={() => setSelectedReview(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsIndex;
