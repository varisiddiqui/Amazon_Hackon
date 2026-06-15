const TOKEN_KEY = "campusflow_token";
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("Cannot reach backend server. Start it with: cd backend && npm run dev");
  }

  let body = {};
  try {
    body = await response.json();
  } catch {
    /* non-json response */
  }

  if (!response.ok) {
    if (response.status === 502 || response.status === 503) {
      throw new Error("Backend server is not running. Start it with: cd backend && npm run dev");
    }
    throw new Error(body.error || body.message || `Request failed (${response.status})`);
  }

  return body;
}

export async function apiGet(path) {
  return apiFetch(path);
}

export async function apiPost(path, data) {
  return apiFetch(path, {
    method: "POST",
    body: JSON.stringify(data ?? {}),
  });
}

export async function apiPut(path, data) {
  return apiFetch(path, {
    method: "PUT",
    body: JSON.stringify(data ?? {}),
  });
}

export async function apiPatch(path, data) {
  return apiFetch(path, {
    method: "PATCH",
    body: JSON.stringify(data ?? {}),
  });
}
