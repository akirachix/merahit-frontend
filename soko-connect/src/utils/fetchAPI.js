const baseUrl = process.env.REACT_APP_BASE_URL;

<<<<<<< HEAD
export const fetchData = async (endpoint) => {

  if (!baseUrl) {
    throw new Error("API base URL is not defined in environment variables.");
  }
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  const url = `${cleanBaseUrl}${cleanEndpoint}`;
  
  console.log("Fetching URL:", url);
=======
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
>>>>>>> 4254aca7ad02b67fa94d75a298086c4c69b2ddd0

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
<<<<<<< HEAD

    if (!response.ok) {
      throw new Error(`Something went wrong: ${response.status}`);
    }
    const result = await response.json();
    return Array.isArray(result) ? result : [];
=======
    if (!response.ok) throw new Error(`Something went wrong: ${response.status}`);
    return await response.json();
>>>>>>> 4254aca7ad02b67fa94d75a298086c4c69b2ddd0
  } catch (error) {
    throw new Error(error.message || "An error occurred");
  }
};
