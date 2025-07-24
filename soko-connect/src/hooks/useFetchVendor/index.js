import { useState, useEffect } from "react";
import { fetchData } from "../../utils/fetchAPI";
export const useVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const users = await fetchData("/users/?usertype=mamamboga");
        setVendors(users);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setVendors([]);
      }
    })();
  }, []);
  return { vendors, loading, error };
};