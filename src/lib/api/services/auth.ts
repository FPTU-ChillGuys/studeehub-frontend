import { apiClient } from "../client";
import { User } from "@/Types";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterRequestWithClientUri,
  RegisterResponse,
  AuthTokens,
  GoogleAuthResponse,
} from "../types/auth";

export class AuthService {
  static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    // Get clientUri from environment variable
    const clientUri = process.env.NEXT_PUBLIC_DEFAULT_CLIENT_URI;

    if (!clientUri) {
      throw new Error(
        "NEXT_PUBLIC_DEFAULT_CLIENT_URI is not configured in environment variables"
      );
    }

    const requestData: RegisterRequestWithClientUri = {
      ...userData,
      clientUri,
    };

    console.log("Register request data:", requestData); // Temporary debug log

    const response = await apiClient.post<AuthResponse | string>(
      "/auth/register",
      requestData
    );

    // Check if response is the expected token structure (object with accessToken)
    if (
      typeof response.data === "object" &&
      response.data !== null &&
      "accessToken" in response.data
    ) {
      const authData = response.data as AuthResponse;

      // If tokens are provided, set them up
      apiClient.setToken(authData.accessToken);

      if (typeof window !== "undefined") {
        localStorage.setItem("refreshToken", authData.refreshToken);
      }

      const user = this.decodeToken(authData.accessToken);
      return {
        success: true,
        message: "Registration and login successful",
        user,
        tokens: {
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
        },
      };
    } else {
      // Registration successful but no auto-login (response is string or different format)
      return {
        success: true,
        message:
          "Registration successful! Please check your email for verification, then login to your account.",
      };
    }
  }

  static async login(
    credentials: LoginRequest
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );

    // Set access token for future requests
    apiClient.setToken(response.data.accessToken);

    // Store refresh token
    if (typeof window !== "undefined") {
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    // Decode JWT to get user info (simple decode without verification)
    const user = this.decodeToken(response.data.accessToken);

    return {
      user,
      tokens: response.data,
    };
  }

  static getCurrentUser(): User | null {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return null;

      return this.decodeToken(token);
    } catch {
      return null;
    }
  }

  static async logout(): Promise<void> {
    try {
      // Call logout API if available
      // await apiClient.post("/auth/logout");
    } finally {
      // Clear tokens regardless of API response
      apiClient.clearToken();
    }
  }

  // Simple JWT decode (client-side only, not for verification)
  private static decodeToken(token: string): User {
    try {
      // Validate token format
      if (!token || typeof token !== "string") {
        throw new Error("Token is null or not a string");
      }

      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      const payload = JSON.parse(atob(tokenParts[1]));

      return {
        id: payload.id || payload.sub,
        email: payload.email,
        name: payload.name || payload.email?.split("@")[0] || "User", // Safer fallback
        role: payload.role || "user",
      };
    } catch {
      throw new Error("Invalid token format");
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() > expiry;
    } catch {
      return true; // Consider invalid tokens as expired
    }
  }

  // Refresh token if needed
  static async loginWithGoogle(
    googleToken: string
  ): Promise<{ tokens: AuthTokens }> {
    const response = await apiClient.post<GoogleAuthResponse>(
      "/auth/google-login",
      {
        idToken: googleToken,
      }
    );

    // Set access token for future requests
    apiClient.setToken(response.data.accessToken);

    // Store refresh token
    if (typeof window !== "undefined") {
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    // Store user data in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return {
      tokens: {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      },
    };
  }

  static async refreshTokenIfNeeded(): Promise<string | null> {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      return null;
    }

    // Check if token is expired or will expire in 5 minutes
    if (!this.isTokenExpired(accessToken)) {
      return accessToken; // Token is still valid
    }

    try {
      // Call refresh endpoint (adjust based on your API)
      const response = await apiClient.post<AuthResponse>(
        "/auth/refresh-token",
        {
          refreshToken,
        }
      );

      // Update stored tokens
      apiClient.setToken(response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      return response.data.accessToken;
    } catch {
      // Refresh failed, clear tokens and redirect to login
      apiClient.clearToken();
      window.location.href = "/";
      return null;
    }
  }
}
