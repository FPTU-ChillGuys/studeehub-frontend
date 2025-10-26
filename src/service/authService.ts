import { apiClient } from "@/lib/api/client";
import { 
  RegisterRequest, 
  AuthResponse, 
  LoginRequest, 
  AuthTokens, 
  RegisterRequestWithClientUri,
} from "@/features/auth";
import { getSession } from "next-auth/react";
import { AuthUser } from "@/Types";
export class AuthService {
  // Register a new user
  static async register(userData: RegisterRequest): Promise<{ success: boolean; message: string }> {
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

    console.log("Register request data:", requestData);

    const response = await apiClient.post<AuthResponse>(
      "/auths/register",
      requestData
    );

    return {
      success: true,
      message: response.message,
    };
  }

  static async login(credentials: LoginRequest): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    const response = await apiClient.post<AuthResponse>(
      "/auths/login",
      credentials
    );
    
    const user = this.decodeToken(response.data.accessToken);

    return {
      user,
      tokens: response.data,
    };
  }

  private static decodeToken(token: string): AuthUser {
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
        role: payload.role || "user",
      };
    } catch {
      throw new Error("Invalid token format");
    }
  }

  // Google OAuth login
  static async loginWithGoogle(googleToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>(
      "/auths/google-login",
      {
        idToken: googleToken,
      }
    );

    return response.data;
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const session = await getSession();
      if (!session?.user) return null;

      return {
        id: session.user.id,
        email: session.user.email || '',
        role: session.user.role as 'user' | 'admin' || 'user',
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  }

  // Get tokens from session
  static async getTokens(): Promise<AuthTokens | null> {
    try {
      const session = await getSession();
      if (!session?.user) return null;

      if (session.accessToken && session.refreshToken) {
        return {
          accessToken: session.accessToken as string,
          refreshToken: session.refreshToken as string,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
  }

  static async refreshTokenIfNeeded(): Promise<string | null> {
    const tokens = await this.getTokens();
    if (!tokens) {  
      return null;
    }
    const accessToken = tokens.accessToken;
    const refreshToken = tokens.refreshToken;

    if (!accessToken || !refreshToken) {
      return null;
    }

    if (!this.isTokenExpired(accessToken)) {
      return accessToken;
    }

    try {
      const response = await apiClient.post<AuthResponse>(
        "/auths/refresh-token",
        {
          refreshToken,
        }
      );

      return response.data.accessToken;
    } catch {
      return null;
    }
  }
}