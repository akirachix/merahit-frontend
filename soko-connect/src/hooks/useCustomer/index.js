import { useState, useEffect } from "react";
import { fetchData } from "../../utils/fetchAPI";
export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const users = await fetchData("/users/");
        setCustomers(users.filter((u) => u.usertype === "customer") || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setCustomers([]);
      }
    })();
  }, []);
  return { customers, loading, error };
};