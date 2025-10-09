// Authentication utilities
import { AuthService } from "./api/services/auth";
import { signIn, signOut as nextAuthSignOut, getSession } from 'next-auth/react';

import { User } from "@/Types";

export type { User };

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
    await nextAuthSignOut({ redirect: false });
    await AuthService.logout();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("user");
    window.location.href = "/";
  }
};

export const redirectBasedOnRole = (user: User): void => {
  if (user.role === "admin" || user.role === "teacher") {
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

  // Check if token is still valid
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return false;

  return !AuthService.isTokenExpired(accessToken);
};

// Validate token with server and refresh if needed
// Google OAuth login
export const loginWithGoogle = async (): Promise<void> => {
  try {
    const result = await signIn('google', { 
      callbackUrl: '/',
      redirect: false 
    });
    
    if (result?.error) {
      console.error('Google sign in error:', result.error);
      return;
    }
    
    const session = await getServerSession();
    if (session?.user) {
      const user: User = {
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: (session.user.role as 'student' | 'teacher' | 'admin') || 'student',
        avatar: session.user.image || undefined
      };
      
      setCurrentUser(user);
      redirectBasedOnRole(user);
    }
  } catch (error) {
    console.error('Error during Google sign in:', error);
  }
};

export const getServerSession = async () => {
  return await getSession();
};

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
