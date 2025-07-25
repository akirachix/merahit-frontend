import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReviewsIndex from "./index";

jest.mock("../hooks/useFetchReviews/index", () => ({
  useReviews: jest.fn(),
}));

import { useReviews } from "../hooks/useFetchReviews/index";

const sampleReviews = [
  {
    id: 1,
    vendor: { full_name: "Vendor One" },
    customer: { full_name: "Customer One" },
    rating: 4,
    comment: "Good product",
    created_at: "2025-07-01T12:00:00Z",
  },
  {
    id: 2,
    vendor: { full_name: "Vendor Two" },
    customer: { full_name: "Customer Two" },
    rating: 5,
    comment: "Excellent!",
    created_at: "2025-07-02T12:00:00Z",
  },
];

describe("ReviewsIndex Component", () => {
  test("renders loading state initially", () => {
    useReviews.mockReturnValue({ reviews: [], loading: true, error: null });
    render(<ReviewsIndex />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("renders error state", () => {
    useReviews.mockReturnValue({ reviews: [], loading: false, error: "Fetch error" });
    render(<ReviewsIndex />);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  test("renders list of reviews and filters by rating", async () => {
    useReviews.mockReturnValue({ reviews: sampleReviews, loading: false, error: null });

    render(<ReviewsIndex />);

    expect(screen.getByText("Vendor One")).toBeInTheDocument();
    expect(screen.getByText("Vendor Two")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/filter by rating/i), { target: { value: "5" } });

    await waitFor(() => {
      expect(screen.queryByText("Vendor One")).not.toBeInTheDocument();
      expect(screen.getByText("Vendor Two")).toBeInTheDocument();
    });
  });

  test("opens and closes modal when review view button clicked", async () => {
    useReviews.mockReturnValue({ reviews: sampleReviews, loading: false, error: null });

    render(<ReviewsIndex />);

    const viewButtons = screen.getAllByText(/view/i);
    fireEvent.click(viewButtons[0]);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/review details/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/close/i));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  test("pagination buttons work", () => {
    const manyReviews = Array.from({ length: 20 }).map((_, i) => ({
      id: i + 1,
      vendor: { full_name: `Vendor ${i + 1}` },
      customer: { full_name: `Customer ${i + 1}` },
      rating: (i % 5) + 1,
      comment: `Comment ${i + 1}`,
      created_at: `2025-07-${(i % 30) + 1}T12:00:00Z`,
    }));

    useReviews.mockReturnValue({ reviews: manyReviews, loading: false, error: null });

    render(<ReviewsIndex />);

    expect(screen.getByText("Vendor 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/next/i));

    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });
});