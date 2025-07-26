const baseUrl = process.env.REACT_APP_BASE_URL;

export const fetchData = async (endpoint) => {

  if (!baseUrl) {
    throw new Error("API base URL is not defined in environment variables.");
  }
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  const url = `${cleanBaseUrl}${cleanEndpoint}`;
  
  console.log("Fetching URL:", url);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Something went wrong: ${response.status}`);
    }
    const result = await response.json();
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    throw new Error(error.message || "An error occurred");
  }
};