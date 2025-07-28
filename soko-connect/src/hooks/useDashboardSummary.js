
import { useOrders } from "./useOrders";
import { useUsers } from "./useUsers";
import { useProducts } from "./useProducts";
import { useDiscounts } from "./useDiscounts";
import { useReviews } from "./useReviews";

export const useDashboardSummary = (period = "all") => {
  const { data: orders, loading: lOrders, error: eOrders } = useOrders(period);
  const { data: users, loading: lUsers, error: eUsers } = useUsers(period);
  const { data: products, loading: lProducts, error: eProducts } = useProducts(period);
  const { data: discounts, loading: lDiscounts, error: eDiscounts } = useDiscounts(period);
  const { data: reviews, loading: lReviews, error: eReviews } = useReviews(period);

  const loading = lOrders || lUsers || lProducts || lDiscounts || lReviews;
  const error = eOrders || eUsers || eProducts || eDiscounts || eReviews;

  const summary =
    orders && users && products && discounts && reviews
      ? {
          totalOrders: orders.length,
          totalCustomers: users.filter((u) => u.usertype === "customer").length,
          totalVendors: users.filter((u) => u.usertype === "mamamboga").length,
          totalProducts: products.length,
          totalOrderAmount:
            orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0,
          averageRating:
            reviews.length
              ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
              : 0,
          activeDiscounts: discounts.filter((d) => new Date(d.end_date) >= new Date()).length,
          productsByCategory:
            products.reduce((acc, product) => {
              acc[product.category] = (acc[product.category] || 0) + 1;
              return acc;
            }, {}) || {},
        }
      : null;

  return { summary, loading, error };
};
