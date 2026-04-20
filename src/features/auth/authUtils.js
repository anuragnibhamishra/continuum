// Authentication utility functions for localStorage management

const AUTH_STORAGE_KEY = "continuum_auth";

/**
 * Save authentication data to localStorage
 * @param {Object} authData - { user, token, refreshToken, expiresAt }
 */
export const saveAuthToStorage = (authData) => {
  try {
    const dataToStore = {
      user: authData.user,
      token: authData.token,
      refreshToken: authData.refreshToken,
      expiresAt: authData.expiresAt,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.error("Error saving auth to localStorage:", error);
  }
};

/**
 * Get authentication data from localStorage
 * @returns {Object|null} - { user, token, refreshToken, expiresAt } or null
 */
export const getAuthFromStorage = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    const authData = JSON.parse(stored);
    
    // Check if token is expired
    if (authData.expiresAt && new Date(authData.expiresAt) < new Date()) {
      clearAuthFromStorage();
      return null;
    }

    return authData;
  } catch (error) {
    console.error("Error reading auth from localStorage:", error);
    clearAuthFromStorage();
    return null;
  }
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuthFromStorage = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing auth from localStorage:", error);
  }
};

/**
 * Check if token is expired
 * @param {string|number} expiresAt - Expiration timestamp
 * @returns {boolean}
 */
export const isTokenExpired = (expiresAt) => {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
};

/**
 * Calculate expiration time from expiresIn (seconds)
 * @param {number} expiresIn - Expiration time in seconds
 * @returns {string} - ISO timestamp
 */
export const calculateExpiresAt = (expiresIn) => {
  const now = new Date();
  now.setSeconds(now.getSeconds() + expiresIn);
  return now.toISOString();
};
