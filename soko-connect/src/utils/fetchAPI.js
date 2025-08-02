const baseUrl = process.env.REACT_APP_BASE_URL;

export const fetchData = async (endpoint, method = 'GET', body = null) => {

  if (!baseUrl) throw new Error("API base URL is not defined in environment variables.");

  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  const url = `${cleanBaseUrl}${cleanEndpoint}`;
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Token ${token}`;


  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) throw new Error(`Something went wrong: ${response.status}`);
    return await response.json();

  } catch (error) {
    throw new Error(error.message || "An error occurred");
  }
};
