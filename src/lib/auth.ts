// Authentication utilities
import { AuthService } from "./api/services/auth";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatar?: string;
}

export const authenticateUser = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const response = await AuthService.login({ email, password });

    // Store user data in localStorage
    setCurrentUser(response.user);

    return response.user;
  } catch (error) {
    console.error("Authentication failed:", error);
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }

    // Fallback: try to get user from token
    return AuthService.getCurrentUser();
  } catch (error) {
    console.error("Error getting current user:", error);
  }
  return null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = async (): Promise<void> => {
  try {
    await AuthService.logout();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("user");
    window.location.href = "/";
  }
};

export const redirectBasedOnRole = (user: User): void => {
  if (user.role === "admin") {
    window.location.href = "/admin";
  } else {
    window.location.href = "/dashboard";
  }
};

// Check if user has admin access
export const isAdmin = (user: User | null): boolean => {
  return user?.role === "admin";
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  // Check if token is still valid
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return false;

  return !AuthService.isTokenExpired(accessToken);
};

// Validate token with server and refresh if needed
export const validateToken = async (): Promise<User | null> => {
  try {
    const newToken = await AuthService.refreshTokenIfNeeded();
    if (!newToken) {
      return null;
    }

    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    return user;
  } catch (error) {
    console.error("Token validation failed:", error);
    localStorage.removeItem("user");
    return null;
  }
};
