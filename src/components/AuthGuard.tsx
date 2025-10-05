"use client";

import React, { useEffect, useState } from "react";
import { getCurrentUser, isAdmin, User } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requireAuth = false,
  requireAdmin = false,
  fallback,
}: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Redirect if auth required but not authenticated
    if (requireAuth && !currentUser) {
      window.location.href = "/";
      return;
    }

    // Redirect if admin required but not admin
    if (requireAdmin && !isAdmin(currentUser)) {
      window.location.href = "/dashboard";
      return;
    }
  }, [requireAuth, requireAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show fallback if provided and conditions not met
  if (
    fallback &&
    ((requireAuth && !user) || (requireAdmin && !isAdmin(user)))
  ) {
    return <>{fallback}</>;
  }

  // Don't render if auth required but not met
  if (requireAuth && !user) {
    return null;
  }

  // Don't render if admin required but not met
  if (requireAdmin && !isAdmin(user)) {
    return null;
  }

  return <>{children}</>;
}
