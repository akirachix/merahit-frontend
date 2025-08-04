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
        const users = await fetchData("/users/?usertype=customer");
        setCustomers(users);  
        setLoading(false);
      } catch (err) {
        setError(err.message || "Something went wrong");
        setCustomers([]);
        setLoading(false);
      }
    })();
  }, []);

  return { customers, loading, error };
};
