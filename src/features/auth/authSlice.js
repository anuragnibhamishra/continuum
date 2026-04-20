import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, verifyTokenAPI, refreshTokenAPI, logoutAPI } from "./authAPI";
import {
  saveAuthToStorage,
  getAuthFromStorage,
  clearAuthFromStorage,
  calculateExpiresAt,
} from "./authUtils";

// 🔹 Async login action
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginAPI(credentials);
      const expiresAt = calculateExpiresAt(response.expiresIn || 3600);

      // Save to localStorage
      saveAuthToStorage({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        expiresAt,
      });

      return {
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        expiresAt,
      };
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

// 🔹 Async logout action
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      // Call logout API if token exists
      if (token) {
        await logoutAPI(token);
      }

      // Clear localStorage
      clearAuthFromStorage();

      return true;
    } catch (err) {
      // Even if API call fails, clear local storage
      clearAuthFromStorage();
      return rejectWithValue(err.message || "Logout failed");
    }
  }
);

// 🔹 Verify token and restore session
export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const storedAuth = getAuthFromStorage();
      
      if (!storedAuth || !storedAuth.token) {
        throw new Error("No stored authentication");
      }

      // Verify token with API
      const response = await verifyTokenAPI(storedAuth.token);

      return {
        user: response.user,
        token: storedAuth.token,
        refreshToken: storedAuth.refreshToken,
        expiresAt: storedAuth.expiresAt,
      };
    } catch (err) {
      // Clear invalid auth data
      clearAuthFromStorage();
      return rejectWithValue(err.message || "Token verification failed");
    }
  }
);

// 🔹 Refresh access token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const refreshTokenValue = state.auth.refreshToken;

      if (!refreshTokenValue) {
        throw new Error("No refresh token available");
      }

      const response = await refreshTokenAPI(refreshTokenValue);
      const expiresAt = calculateExpiresAt(response.expiresIn || 3600);

      // Update localStorage
      const storedAuth = getAuthFromStorage();
      if (storedAuth) {
        saveAuthToStorage({
          ...storedAuth,
          token: response.token,
          refreshToken: response.refreshToken,
          expiresAt,
        });
      }

      return {
        token: response.token,
        refreshToken: response.refreshToken,
        expiresAt,
      };
    } catch (err) {
      // If refresh fails, clear auth and logout
      clearAuthFromStorage();
      return rejectWithValue(err.message || "Token refresh failed");
    }
  }
);

// 🔹 Initialize auth from localStorage
export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { dispatch }) => {
    const storedAuth = getAuthFromStorage();
    
    if (storedAuth && storedAuth.token) {
      // Verify the stored token
      return dispatch(verifyToken()).unwrap();
    }
    
    return null;
  }
);

// Initial state - try to load from localStorage
const getInitialState = () => {
  const storedAuth = getAuthFromStorage();
  
  if (storedAuth && storedAuth.token) {
    return {
      isAuthenticated: true,
      user: storedAuth.user,
      token: storedAuth.token,
      refreshToken: storedAuth.refreshToken,
      expiresAt: storedAuth.expiresAt,
      status: "idle",
      error: null,
      isInitialized: false, // Will be set to true after verification
    };
  }

  return {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    expiresAt: null,
    status: "idle",
    error: null,
    isInitialized: false,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setInitialized(state) {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.error = action.payload;
      });

    // Logout cases
    builder
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        // Even if logout API fails, clear local state
        state.status = "idle";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.error = action.payload;
      });

    // Verify token cases
    builder
      .addCase(verifyToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.status = "idle";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.isInitialized = true;
        state.error = action.payload;
      });

    // Refresh token cases
    builder
      .addCase(refreshToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.error = action.payload;
      });

    // Initialize auth cases
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.expiresAt = action.payload.expiresAt;
        }
        state.isInitialized = true;
        state.status = "idle";
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isInitialized = true;
        state.status = "idle";
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;
                                                           