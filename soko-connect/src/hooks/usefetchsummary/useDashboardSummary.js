import { useState, useEffect } from "react";
import { fetchData } from "../../utils/fetchAPI";

export const useDashboardSummary = (period = "all") => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseEndpoint = (path) =>
          period === "all" ? path : `${path}?period=${period}`;

        const [
          orders,
          users,
          products,
          orderItems,
          payments,
          carts,
          discounts,
          reviews,
        ] = await Promise.all([
          fetchData(baseEndpoint("/order/")),
          fetchData(baseEndpoint("/users/")),
          fetchData(baseEndpoint("/product/")),
          fetchData(baseEndpoint("/orderItem/")),
          fetchData(baseEndpoint("/payment/")),
          fetchData(baseEndpoint("/cart/")),
          fetchData(baseEndpoint("/discount/")),
          fetchData(baseEndpoint("/review/")),
        ]);

        if (!isMounted) return;

        setSummary({
          totalOrders: orders?.length || 0,
          totalCustomers: users?.filter((u) => u.usertype === "customer").length || 0,
          totalVendors: users?.filter((u) => u.usertype === "mamamboga").length || 0,
          totalProducts: products?.length || 0,
          totalOrderItems: orderItems?.length || 0,
          totalPayments: payments?.length || 0,
          totalCarts: carts?.length || 0,
          totalDiscounts: discounts?.length || 0,
          totalReviews: reviews?.length || 0,
          ordersByStatus:
            orders?.reduce((acc, order) => {
              acc[order.status] = (acc[order.status] || 0) + 1;
              return acc;
            }, {}) || {},
          productsByCategory:
            products?.reduce((acc, product) => {
              acc[product.category] = (acc[product.category] || 0) + 1;
              return acc;
            }, {}) || {},
          totalOrderAmount:
            orders?.reduce(
              (sum, order) => sum + parseFloat(order.total_amount || 0),
              0
            ) || 0,
          averageRating:
            reviews?.length > 0
              ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
                reviews.length
              : 0,
          activeDiscounts:
            discounts?.filter((d) => new Date(d.end_date) >= new Date()).length ||
            0,
        });
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Something went wrong");
        setSummary(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, [period]);

  return { summary, loading, error };
};
