
import { useState, useEffect } from "react";
import { fetchData } from "../../utils/fetchAPI";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchData("/product/");
        setProducts(data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setProducts([]);
      }
    })();
  }, []);

  return { products, loading, error };
};





