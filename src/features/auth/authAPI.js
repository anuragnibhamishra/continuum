// Auth API Service Layer
// This abstracts the authentication API calls

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

/**
 * Mock login API - Replace with actual API call
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - { user, token, refreshToken }
 */
export const loginAPI = async (credentials) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Validate input
  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required");
  }

  // Mock authentication logic - Email/Password login
  // Demo credentials: test@continuum.com / 123456
  if (
    credentials.email === "anuragmishranibha@gmail.com" &&
    credentials.password === "Anurag@2608"
  ) {
    return {
      user: {
        id: 1,
        name: "Anurag Nibha Mishra",
        email: credentials.email,
        avatar: null,
      },
      token: "fake-jwt-token-" + Date.now(),
      refreshToken: "fake-refresh-token-" + Date.now(),
      expiresIn: 3600, // 1 hour in seconds
    };
  }

  // Invalid credentials
  throw new Error("Invalid email or password");
};

/**
 * Verify token validity
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - User data
 */
export const verifyTokenAPI = async (token) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock token verification
  if (token && token.startsWith("fake-jwt-token")) {
    return {
      user: {
        id: 1,
        name: "Anurag Nibha Mishra",
        email: "anuragmishranibha@gmail.com",
        avatar: null,
      },
    };
  }

  throw new Error("Invalid or expired token");
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} - { token, refreshToken, expiresIn }
 */
export const refreshTokenAPI = async (refreshToken) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (refreshToken && refreshToken.startsWith("fake-refresh-token")) {
    return {
      token: "fake-jwt-token-" + Date.now(),
      refreshToken: "fake-refresh-token-" + Date.now(),
      expiresIn: 3600,
    };
  }

  throw new Error("Invalid refresh token");
};

/**
 * Logout API call (optional - for server-side session invalidation)
 * @param {string} token - JWT token
 * @returns {Promise<void>}
 */
export const logoutAPI = async (token) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // In a real app, this would invalidate the token on the server
  // For now, just return success
  return { success: true };
};
