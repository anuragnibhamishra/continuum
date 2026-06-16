/**
 * Local mock auth for development when no backend is available.
 * Credentials come from .env — never hardcode secrets in source.
 */

const MOCK_EMAIL = import.meta.env.VITE_MOCK_LOGIN_EMAIL || "demo@continuum.local";
const MOCK_PASSWORD = import.meta.env.VITE_MOCK_LOGIN_PASSWORD || "demo123456";
const MOCK_USER_NAME = import.meta.env.VITE_MOCK_LOGIN_NAME || "Demo User";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mockUser(email) {
  return {
    id: 1,
    name: MOCK_USER_NAME,
    email,
    avatar: null,
  };
}

export async function mockLoginAPI(credentials) {
  await delay(400);

  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required");
  }

  if (credentials.email === MOCK_EMAIL && credentials.password === MOCK_PASSWORD) {
    return {
      user: mockUser(credentials.email),
      token: `mock-jwt-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
      expiresIn: 3600,
    };
  }

  throw new Error("Invalid email or password");
}

export async function mockVerifyTokenAPI(token) {
  await delay(200);

  if (token?.startsWith("mock-jwt-token") || token?.startsWith("fake-jwt-token")) {
    return { user: mockUser(MOCK_EMAIL) };
  }

  throw new Error("Invalid or expired token");
}

export async function mockRefreshTokenAPI(refreshToken) {
  await delay(200);

  if (
    refreshToken?.startsWith("mock-refresh-token") ||
    refreshToken?.startsWith("fake-refresh-token")
  ) {
    return {
      token: `mock-jwt-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
      expiresIn: 3600,
    };
  }

  throw new Error("Invalid refresh token");
}

export async function mockLogoutAPI() {
  await delay(100);
  return { success: true };
}

export function isMockAuthEnabled() {
  return import.meta.env.VITE_USE_MOCK_AUTH === "true";
}
