import { describe, it, expect } from "vitest";
import authReducer, { clearError, login, logout, verifyToken } from "../features/auth/authSlice";

const baseState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  expiresAt: null,
  status: "idle",
  error: "Something went wrong",
  isInitialized: false,
};

describe("authSlice reducers", () => {
  it("clearError resets error to null", () => {
    const next = authReducer(baseState, clearError());
    expect(next.error).toBeNull();
  });
});

describe("authSlice login", () => {
  it("sets authenticated state on fulfilled login", () => {
    const payload = {
      user: { id: 1, name: "Test", email: "test@example.com" },
      token: "jwt-token",
      refreshToken: "refresh-token",
      expiresAt: Date.now() + 3600000,
    };
    const next = authReducer(baseState, { type: login.fulfilled.type, payload });
    expect(next.isAuthenticated).toBe(true);
    expect(next.user).toEqual(payload.user);
    expect(next.token).toBe("jwt-token");
    expect(next.status).toBe("succeeded");
    expect(next.error).toBeNull();
  });

  it("clears auth state on rejected login", () => {
    const next = authReducer(baseState, {
      type: login.rejected.type,
      payload: "Invalid credentials",
    });
    expect(next.isAuthenticated).toBe(false);
    expect(next.user).toBeNull();
    expect(next.error).toBe("Invalid credentials");
    expect(next.status).toBe("failed");
  });
});

describe("authSlice logout", () => {
  it("clears session on fulfilled logout", () => {
    const loggedIn = {
      ...baseState,
      isAuthenticated: true,
      user: { id: 1, name: "Test", email: "test@example.com" },
      token: "jwt-token",
      refreshToken: "refresh-token",
      expiresAt: Date.now() + 3600000,
      error: null,
    };
    const next = authReducer(loggedIn, { type: logout.fulfilled.type });
    expect(next.isAuthenticated).toBe(false);
    expect(next.user).toBeNull();
    expect(next.token).toBeNull();
  });
});

describe("authSlice verifyToken", () => {
  it("marks initialized on rejected verify", () => {
    const next = authReducer(baseState, {
      type: verifyToken.rejected.type,
      payload: "Invalid token",
    });
    expect(next.isInitialized).toBe(true);
    expect(next.isAuthenticated).toBe(false);
  });
});
