import React, { useState, useEffect } from "react";
import { useProducts } from "../hooks/usefetchproducts/index";
import "./style.css";

function capitalize(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const ProductsIndex = () => {
  const { products: fetchedProducts, loading, error } = useProducts();

  const capitalizedProducts = fetchedProducts.map((product) => ({
    ...product,
    product_name: capitalize(product.product_name),
    category: capitalize(product.category),
    stock_unit: capitalize(product.stock_unit),
  }));

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const filtered = capitalizedProducts
      .filter((p) => {
        const matchesCategory =
          categoryFilter === "all" ||
          (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());

        const matchesSearch = p.product_name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setFilteredProducts(filtered);
  }, [capitalizedProducts, searchTerm, categoryFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, capitalizedProducts.length]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = filteredProducts.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    if (selectedProduct) {
      const timer = setTimeout(() => setShowModal(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [selectedProduct]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}. Check console.</div>;

  return (
    <div className="products-container">
      <div className="page-banner">
        <p>Product Listings and Inventory</p>
      </div>

      <div className="search-container left-align">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Search products"
        />
        <select
          className="category-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          <option value="fish">Fish</option>
          <option value="vegetable">Vegetable</option>
          <option value="cereals">Cereals</option>
          <option value="others">Others</option>
        </select>
      </div>

      <div className="products-content">
        {paginatedProducts.length > 0 ? (
          <>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.product_image}
                        alt={product.product_name}
                        className="product-thumb-image"
                        onError={(e) => (e.target.src = "/fallback-image.png")}
                      />
                    </td>
                    <td>{product.product_name}</td>
                    <td>{product.category}</td>
                    <td>KSH {product.price}</td>
                    <td>
                      {product.stock_quantity} {product.stock_unit}
                    </td>
                    <td>
                      <button onClick={() => setSelectedProduct(product)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                aria-label="Previous page"
              >
                Previous
              </button>

              <span className="page-number">
                Page {safeCurrentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="no-data">No product data available.</div>
        )}

        {selectedProduct && (
          <div
            className="modal-overlay"
            style={{ display: showModal ? "flex" : "none" }}
            onClick={() => setSelectedProduct(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-details-title"
          >
            <div className="product-details" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content-flex">
                <img
                  src={selectedProduct.product_image}
                  alt={selectedProduct.product_name}
                  className="modal-product-image-circle"
                  onError={(e) => (e.target.src = "/fallback-image.png")}
                />
                <div className="modal-product-info">
                  <h2 id="product-details-title">{selectedProduct.product_name}</h2>
                  <p>
                    <strong>Category:</strong> {selectedProduct.category}
                  </p>
                  <p>
                    <strong>Price:</strong> KSH {selectedProduct.price}
                  </p>
                  <p>
                    <strong>Stock:</strong> {selectedProduct.stock_quantity} {selectedProduct.stock_unit}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedProduct.description || "N/A"}
                  </p>
                  <p>
                    <strong>Created:</strong> {new Date(selectedProduct.created_at).toLocaleDateString()}
                  </p>
                  <button onClick={() => setSelectedProduct(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsIndex;
