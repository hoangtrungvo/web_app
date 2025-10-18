// Custom hook for Authentication
import { useState, useEffect } from "react";
import { authApi } from "../config/api";
import { API_CONFIG } from "../config/api.config";

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  gender?: string;
  role: string;
  isActive: boolean;
  status?: boolean;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginError: string;
}

const TOKEN_KEY = "admin_token";
const USER_KEY = "admin_user";
const REFRESH_TOKEN_KEY = "admin_refresh_token";

// JWT Token Payload interface
interface JWTPayload {
  sub: string; // subject (user id)
  exp: number; // expiration time (unix timestamp)
  iat: number; // issued at time
  iss?: string; // issuer
  aud?: string; // audience
  [key: string]: any; // additional claims
}

// Decode JWT token payload
const decodeToken = (token: string): JWTPayload | null => {
  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT token format");
    }

    // Decode payload (middle part)
    const payload = parts[1];

    // Convert base64url to base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if needed
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    // Decode base64 to string
    const decodedPayload = atob(paddedBase64);

    // Parse JSON
    const jwtPayload: JWTPayload = JSON.parse(decodedPayload);

    return jwtPayload;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true; // Consider expired if can't decode or no exp
  }

  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

// Get user info from token payload
const getUserFromToken = (token: string): AuthUser | null => {
  const payload = decodeToken(token);
  if (!payload) return null;

  // Get Role from payload (handle different role claim formats)
  let role = payload.role;
  if (!role && payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
    role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  }

  console.log("Decoded JWT Payload:", payload);

  // Extract user info from payload (adjust based on your JWT structure)
  return {
    id: payload.sub || "",
    username: payload.username || payload.email || "",
    email: payload.email || "",
    fullName: payload.fullName || payload.name || "",
    gender: payload.gender,
    role: role || "ROLE_USER",
    isActive: payload.isActive !== false,
    status: payload.status !== false,
  };
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    loginError: "",
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);

        if (token) {
          // Check if token is expired using JWT payload
          if (isTokenExpired(token)) {
            logout();
            return;
          }

          // Get user info from token payload
          const user = getUserFromToken(token);
          if (user) {
            // Save user to localStorage for convenience
            localStorage.setItem(USER_KEY, JSON.stringify(user));
          }

          setAuthState({
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            loginError: "",
          });
        } else {
          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        logout();
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Test account - no API call needed
      if (credentials.username === "admin_test" && credentials.password === "admin123") {
        // Create a mock test token and user
        const mockToken = "mock_test_token_" + Math.random().toString(36);
        const mockUser: AuthUser = {
          id: "test-user-id-12345",
          username: "admin_test",
          email: "admin_test@petstore.local",
          fullName: "Test Admin",
          gender: "MALE",
          role: "ROLE_ADMIN",
          isActive: true,
          status: true,
        };

        // Save to localStorage
        localStorage.setItem(TOKEN_KEY, mockToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, "mock_refresh_token");
        localStorage.setItem(USER_KEY, JSON.stringify(mockUser));

        setAuthState({
          token: mockToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          loginError: "",
        });
        console.log("✅ Test account login successful");
        return true;
      }

      // Regular login via API
      const response = await authApi.login(credentials.username, credentials.password);
      const { accessToken, refreshToken } = response;

      // Get user info from token payload
      const user = getUserFromToken(accessToken);
      if (!user) {
        throw new Error("Invalid token payload");
      }

      // Check if user has permission to access dashboard
      if (user.role === "ROLE_USER") {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Bạn không có quyền truy cập dashboard",
          loginError: "Bạn không có quyền truy cập dashboard",
        }));
        console.log("❌ ROLE_USER cannot access dashboard");
        return false;
      } else {
        // Save to localStorage
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        setAuthState({
          token: accessToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          loginError: "",
        });
        console.log("✅ Login successful");
        return true;
      }
    } catch (error) {
      console.error("Login failed:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Invalid username or password",
      }));
      return false;
    }
  };
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("admin_token_expiration");
    setAuthState({
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      loginError: "",
    });
  };

  const clearError = () => {
    setAuthState((prev) => ({
      ...prev,
      error: null,
    }));
  };

  // Get current user from token
  const getCurrentUser = (): AuthUser | null => {
    if (!authState.token) return null;
    return getUserFromToken(authState.token);
  };

  // Get decoded token payload
  const getTokenPayload = (): JWTPayload | null => {
    if (!authState.token) return null;
    return decodeToken(authState.token);
  };

  // Refresh access token using refresh token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshTokenValue) {
        console.error("No refresh token available");
        logout();
        return false;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          refreshToken: refreshTokenValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const { accessToken, refreshToken: newRefreshToken } = data;

      // Get user info from new token payload
      const user = getUserFromToken(accessToken);
      if (!user) {
        throw new Error("Invalid token payload in refresh response");
      }

      // Update localStorage with new tokens
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      // Update auth state
      setAuthState({
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginError: "",
      });

      console.log("✅ Token refreshed successfully");
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout(); // Clear all tokens on refresh failure
      return false;
    }
  };

  return {
    ...authState,
    login,
    logout,
    clearError,
    getCurrentUser,
    getTokenPayload,
    refreshToken,
  };
};
