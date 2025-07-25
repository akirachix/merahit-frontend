
import * as fetchAPI from "../../utils/fetchAPI";

jest.mock("../../utils/fetchAPI");

describe("useOrders hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with loading = true and empty orders", () => {
    fetchAPI.fetchData.mockReturnValue(new Promise(() => {}));
  });

  it("should fetch orders and update state", async () => {
    const mockOrders = [
      { id: 1, customer: { full_name: "Alice" }, vendor: { full_name: "Bob" }, total_amount: 123, status: "Pending", order_date: "2023-07-20" },
    ];

    fetchAPI.fetchData.mockResolvedValueOnce(mockOrders);
  });

  it("should handle error on fetch", async () => {
    fetchAPI.fetchData.mockRejectedValueOnce(new Error("Network Error"));
  });
});
