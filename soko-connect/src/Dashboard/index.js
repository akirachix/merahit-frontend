import React, { useState } from "react";
import { useDashboardSummary } from "../hooks/usefetchsummary/useDashboardSummary";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./style.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  const { summary, loading, error } = useDashboardSummary(timeFilter);

  // Helper to get CSS variable values for colors
  const getCssVar = (varName, fallback) => {
    if (typeof window !== "undefined") {
      const val = getComputedStyle(document.documentElement).getPropertyValue(varName);
      return val ? val.trim() : fallback;
    }
    return fallback;
  };

  const colors = {
    greenLight: getCssVar("--color-green-light", "rgba(76, 175, 80, 0.6)"),
    greenDark: getCssVar("--color-green-dark", "rgba(76, 175, 80, 1)"),
    yellowLight: getCssVar("--color-yellow-light", "rgba(255, 235, 59, 0.6)"),
    yellowDark: getCssVar("--color-yellow-dark", "rgba(255, 235, 59, 1)"),
    blueLight: getCssVar("--color-blue-light", "rgba(33, 150, 243, 0.6)"),
    blueDark: getCssVar("--color-blue-dark", "rgba(33, 150, 243, 1)"),
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}. Check console.</div>;

  const totalCountsData = {
    labels: ["Orders", "Customers", "Vendors", "Products"],
    datasets: [
      {
        label: "Key Metrics",
        data: [
          summary.totalOrders || 0,
          summary.totalCustomers || 0,
          summary.totalVendors || 0,
          summary.totalProducts || 0,
        ],
        backgroundColor: colors.greenLight,
        borderColor: colors.greenDark,
        borderWidth: 1,
      },
    ],
  };

  const ordersByStatusData = {
    labels: Object.keys(summary.ordersByStatus || {}),
    datasets: [
      {
        data: Object.values(summary.ordersByStatus || {}),
        backgroundColor: [
          colors.greenLight,
          colors.yellowLight,
          colors.blueLight,
          colors.greenLight,
        ].slice(0, Object.keys(summary.ordersByStatus || {}).length),
        borderColor: [
          colors.greenDark,
          colors.yellowDark,
          colors.blueDark,
          colors.greenDark,
        ].slice(0, Object.keys(summary.ordersByStatus || {}).length),
        borderWidth: 1,
      },
    ],
  };

  const productsByCategoryData = {
    labels: Object.keys(summary.productsByCategory || {}),
    datasets: [
      {
        data: Object.values(summary.productsByCategory || {}),
        backgroundColor: [
          colors.blueLight,
          colors.yellowLight,
          colors.greenLight,
          colors.blueLight,
        ].slice(0, Object.keys(summary.productsByCategory || {}).length),
        borderColor: [
          colors.blueDark,
          colors.yellowDark,
          colors.greenDark,
          colors.blueDark,
        ].slice(0, Object.keys(summary.productsByCategory || {}).length),
        borderWidth: 1,
      },
    ],
  };

  const financialData = {
    labels: ["Total Order Amount", "Avg Rating", "Active Discounts"],
    datasets: [
      {
        label: "Financial & Rating Metrics",
        data: [
          summary.totalOrderAmount || 0,
          summary.averageRating || 0,
          summary.activeDiscounts || 0,
        ],
        backgroundColor: colors.blueLight,
        borderColor: colors.blueDark,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    indexAxis: "y",
    plugins: {
      ...chartOptions.plugins,
      legend: { display: false },
    },
    scales: {
      x: { beginAtZero: true },
    },
  };

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case "30d":
        return "Last 30 Days";
      case "7d":
        return "Last 7 Days";
      default:
        return "All Time";
    }
  };

  const metrics = [
    { value: summary.totalOrders || 0, label: "Total Orders" },
    { value: summary.totalCustomers || 0, label: "Total Customers" },
    { value: summary.totalVendors || 0, label: "Total Vendors" },
    { value: summary.totalProducts || 0, label: "Total Products" },
    { value: `KES ${summary.totalOrderAmount || 0}`, label: "Total Sales" },
    { value: summary.averageRating ? summary.averageRating.toFixed(1) : 0, label: "Avg Rating" },
    { value: summary.activeDiscounts || 0, label: "Active Discounts" },
  ];

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Platform Overview - {getTimeFilterLabel()}</h2>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="time-filter"
        >
          <option value="all">All Time</option>
          <option value="30d">Last 30 Days</option>
          <option value="7d">Last 7 Days</option>
        </select>
      </div>

      {summary && Object.keys(summary).length > 0 ? (
        <>
          <div className="metrics-grid">
            {metrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="summary-graphs">
            <div className="graph-container pie-chart orders-chart">
              <h3>Orders by Status</h3>
              <div className="chart-wrapper">
                <Pie
                  data={ordersByStatusData}
                  options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: "Orders Breakdown" } } }}
                />
              </div>
            </div>

            <div className="graph-container pie-chart products-chart">
              <h3>Products by Category</h3>
              <div className="chart-wrapper">
                <Pie
                  data={productsByCategoryData}
                  options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: "Product Categories" } } }}
                />
              </div>
            </div>

            <div className="graph-container bar-chart total-counts-chart">
              <h3>Key Metrics</h3>
              <div className="chart-wrapper">
                <Bar
                  data={totalCountsData}
                  options={{ ...barChartOptions, plugins: { ...barChartOptions.plugins, title: { display: true, text: "Key Entity Totals" } } }}
                />
              </div>
            </div>

            <div className="graph-container bar-chart financial-chart">
              <h3>Financial & Rating Metrics</h3>
              <div className="chart-wrapper">
                <Bar
                  data={financialData}
                  options={{ ...barChartOptions, plugins: { ...barChartOptions.plugins, title: { display: true, text: "Financial & Rating Overview" } } }}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="no-data">No summary data available.</div>
      )}
    </div>
  );
};

const DashboardIndex = () => {
  return (
    <div className="dashboard-container">
      <div className="page-banner">
        <h1>Overview of platform metrics and analytics</h1>
      </div>
      <Dashboard />
    </div>
  );
};

export default DashboardIndex;
