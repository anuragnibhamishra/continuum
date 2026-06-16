// Auth API Service Layer

import {
  isMockAuthEnabled,
  mockLoginAPI,
  mockVerifyTokenAPI,
  mockRefreshTokenAPI,
  mockLogoutAPI,
} from "./authMock";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function requireApiUrl() {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_URL is not configured. Set it in .env or enable VITE_USE_MOCK_AUTH=true for local dev."
    );
  }
}

async function apiFetch(path, options = {}) {
  requireApiUrl();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed (${res.status})`);
  }

  return data;
}

export const loginAPI = async (credentials) => {
  if (isMockAuthEnabled()) {
    return mockLoginAPI(credentials);
  }

  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required");
  }

  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });
};

export const verifyTokenAPI = async (token) => {
  if (isMockAuthEnabled()) {
    return mockVerifyTokenAPI(token);
  }

  if (!token) {
    throw new Error("No token provided");
  }

  return apiFetch("/auth/verify", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const refreshTokenAPI = async (refreshToken) => {
  if (isMockAuthEnabled()) {
    return mockRefreshTokenAPI(refreshToken);
  }

  if (!refreshToken) {
    throw new Error("No refresh token provided");
  }

  return apiFetch("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
};

export const logoutAPI = async (token) => {
  if (isMockAuthEnabled()) {
    return mockLogoutAPI(token);
  }

  if (!token) {
    return { success: true };
  }

  return apiFetch("/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
};
