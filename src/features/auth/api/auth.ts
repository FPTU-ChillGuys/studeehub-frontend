import { AuthUser } from "@/Types";

import {
  signIn,
  signOut,
  getSession,
} from "next-auth/react";
import { AuthService } from "../../../service/authService";


export const authenticateUser = async (
  email: string,
  password: string
): Promise<AuthUser | null> => {
  try {
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!response?.ok) {
      return null;
    }
    
    return await getCurrentUser();
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const session = await getSession();
    return session?.user as AuthUser;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const logout = (): void => {
  try {
    signOut({ callbackUrl: '/' })
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const redirectBasedOnRole = (user: AuthUser): void => {
  if (user.role === "admin") {
    window.location.href = "/admin";
  } else {
    window.location.href = "/user/my-documents";
  }
};

// Check if user has admin access
export const isAdmin = (user: AuthUser | null): boolean => {
  return user?.role === "admin";
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const tokens = await AuthService.getTokens();
  if (!tokens) return false;
  return !AuthService.isTokenExpired(tokens.accessToken);
};

// Validate token with server and refresh if needed
// Google OAuth login
export const loginWithGoogle = async (): Promise<void> => {
  try {
    const result = await signIn("google", {
      callbackUrl: "/auth/callback",
      redirect: true,
    });

    if (result?.error) {
      console.error("Google sign in error:", result.error);
      return;
    }
  } catch (error) {
    console.error("Error during Google sign in:", error);
  }
};