
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReviewsIndex from "./index";
import * as useReviewsHook from "../hooks/useFetchReviews";


jest.mock("./style.css", () => ({}));

describe("ReviewsIndex Component", () => {
  const mockReviews = [
    {
      id: 1,
      vendor: { full_name: "Vendor A" },
      customer: { full_name: "Customer A" },
      rating: 4,
      comment: "Good service",
      created_at: "2023-07-10T12:00:00Z",
    },
    {
      id: 2,
      vendor: { full_name: "Vendor B" },
      customer: { full_name: "Customer B" },
      rating: 5,
      comment: "Excellent!",
      created_at: "2023-07-15T12:00:00Z",
    },
    {
      id: 3,
      vendor: { full_name: "Vendor C" },
      customer: { full_name: "Customer C" },
      rating: 3,
      comment: "",
      created_at: "2023-07-12T12:00:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading indicator while loading", () => {
    jest.spyOn(useReviewsHook, "useReviews").mockReturnValue({
      reviews: [],
      loading: true,
      error: null,
    });

    render(<ReviewsIndex />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("displays error message when error occurs", () => {
    const errorMessage = "Failed to fetch reviews";

    jest.spyOn(useReviewsHook, "useReviews").mockReturnValue({
      reviews: [],
      loading: false,
      error: errorMessage,
    });

    render(<ReviewsIndex />);
    expect(screen.getByText(new RegExp(errorMessage, "i"))).toBeInTheDocument();
  });

  it("renders reviews sorted by created_at descending and paginates correctly", () => {
    jest.spyOn(useReviewsHook, "useReviews").mockReturnValue({
      reviews: mockReviews,
      loading: false,
      error: null,
    });

    render(<ReviewsIndex />);

    
    const rows = screen.getAllByRole("row");
   
    expect(rows[1]).toHaveTextContent("Vendor B");
    expect(rows[2]).toHaveTextContent("Vendor C");
    expect(rows[3]).toHaveTextContent("Vendor A");
  });

  it("pagination buttons work and disable correctly", () => {
 
    const largeReviews = Array.from({ length: 21 }, (_, i) => ({
      id: i + 1,
      vendor: { full_name: `Vendor ${i + 1}` },
      customer: { full_name: `Customer ${i + 1}` },
      rating: (i % 5) + 1,
      comment: `Comment ${i + 1}`,
      created_at: new Date(Date.now() - i * 1000 * 60).toISOString(),
    }));

    jest.spyOn(useReviewsHook, "useReviews").mockReturnValue({
      reviews: largeReviews,
      loading: false,
      error: null,
    });

    render(<ReviewsIndex />);

    const prevBtn = screen.getByText(/previous/i);
    const nextBtn = screen.getByText(/next/i);
    const pageInfo = screen.getByText(/1 \/ 3/i);

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeEnabled();
    expect(pageInfo).toBeInTheDocument();

  
    fireEvent.click(nextBtn);

    expect(screen.getByText(/2 \/ 3/i)).toBeInTheDocument();
    expect(prevBtn).toBeEnabled();

   
    fireEvent.click(nextBtn);
    expect(screen.getByText(/3 \/ 3/i)).toBeInTheDocument();
    expect(nextBtn).toBeDisabled();

   
    fireEvent.click(prevBtn);
    expect(screen.getByText(/2 \/ 3/i)).toBeInTheDocument();
    expect(nextBtn).toBeEnabled();
  });

  test("opens modal displaying correct review details and closes modal", async () => {
    jest.spyOn(useReviewsHook, "useReviews").mockReturnValue({
      reviews: mockReviews,
      loading: false,
      error: null,
    });

    render(<ReviewsIndex />);

    const viewButtons = screen.getAllByText(/view/i);
    fireEvent.click(viewButtons[0]);


    await waitFor(() => {
      expect(screen.getByText(/review details/i)).toBeVisible();
    });
  
    fireEvent.click(screen.getByText(/close/i));

    await waitFor(() => {
      expect(screen.queryByText(/review details/i)).not.toBeInTheDocument();
    });
  });

  test("displays 'N/A' for empty comment in modal", async () => {
   
    const reviewsWithEmptyComment = [
      {
        id: 3,
        vendor: { full_name: "Vendor C" },
        customer: { full_name: "Customer C" },
        rating: 3,
        comment: "",
        created_at: "2023-07-12T12:00:00Z",
      },
    ];

    jest.spyOn(useReviewsHook, "useReviews").mockReturnValue({
      reviews: reviewsWithEmptyComment,
      loading: false,
      error: null,
    });

    render(<ReviewsIndex />);

    const viewButton = screen.getByText(/view/i);
    fireEvent.click(viewButton);

    await waitFor(() => {
      expect(screen.getByText(/review details/i)).toBeVisible();
    });

  });

  test("shows 'No review data available.' when reviews is empty", () => {
    jest.spyOn(useReviewsHook, "useReviews").mockReturnValue({
      reviews: [],
      loading: false,
      error: null,
    });

    render(<ReviewsIndex />);
    expect(screen.getByText(/no review data available/i)).toBeInTheDocument();
  });
});
