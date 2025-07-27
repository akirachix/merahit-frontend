import { useState, useEffect } from "react";
import { fetchData } from "../../utils/fetchAPI";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async (orderId) => {

    return {}; 
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchData("/order/");
        const ordersList = Array.isArray(data)
          ? data
          : (data && Array.isArray(data.results) ? data.results : []);

        setOrders(ordersList);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setOrders([]);
        setLoading(false);
      }
    })();
  }, []);

  return { orders, loading, error, fetchOrderDetails };
};
