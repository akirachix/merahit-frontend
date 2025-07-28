import React, { useState } from "react";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  const { summary, loading, error } = useDashboardSummary(timeFilter);

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
        backgroundColor: [
          colors.greenLight,
          colors.yellowLight,
          colors.blueLight,
          colors.greenLight,
        ],
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
        borderWidth: 1,
      },
    ],
  };

  const salesTrendLabels = Object.keys(summary.salesByDate || {});
  const salesTrendValues = Object.values(summary.salesByDate || {});

  const totalSalesTrendData = {
    labels: salesTrendLabels,
    datasets: [
      {
        label: "Total Sales Over Time",
        data: salesTrendValues,
        fill: false,
        backgroundColor: colors.blueLight,
        borderColor: colors.blueDark,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const commonPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true },
    },
  };

  const commonBarOptions = {
    ...commonPieOptions,
    indexAxis: "y",
    plugins: {
      ...commonPieOptions.plugins,
      legend: { display: false },
    },
    scales: {
      x: { beginAtZero: true },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 16 } } },
      title: { display: true, text: "Total Sales Trend", font: { size: 18 } },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        display: true,
        title: { display: true, text: "Date", font: { size: 14 } },
        ticks: { font: { size: 14 } },
        type: "category",
      },
      y: {
        display: true,
        title: { display: true, text: "Sales (KES)", font: { size: 14 } },
        ticks: { font: { size: 14 } },
        beginAtZero: true,
      },
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
    {
      value: summary.averageRating ? summary.averageRating.toFixed(1) : 0,
      label: "Avg Rating",
    },
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
            {metrics.map((metric, idx) => (
              <div key={idx} className="metric-card">
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="summary-graphs">

            <div className="graph-container pie-chart products-chart">
              <h3>Products by Category</h3>
              <div className="chart-wrapper large-chart">
                <Pie
                  data={productsByCategoryData}
                  options={{
                    ...commonPieOptions,
                    plugins: {
                      ...commonPieOptions.plugins,
                    },
                  }}
                />
              </div>
            </div>

            <div className="graph-container bar-chart total-counts-chart">
              <h3>Key Metrics</h3>
              <div className="chart-wrapper large-chart">
                <Bar
                  data={totalCountsData}
                  options={{
                    ...commonBarOptions,
                    plugins: {
                      ...commonBarOptions.plugins,
                    },
                  }}
                />
              </div>
            </div>
            <div className="graph-container line-chart total-sales-trend-chart">
              <div className="chart-wrapper large-chart">
                <Line data={totalSalesTrendData} options={lineChartOptions} />
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
        <p>Overview of platform metrics and analytics</p>
      </div>
      <Dashboard />
    </div>
  );
};

export default DashboardIndex;
