export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(url, { ...options, headers });

  let data;
  try {
    data = await res.clone().json();
  } catch {
    data = await res.clone().text();
  }

  if (!res.ok) throw new Error(data.message || data);
  return data;
};