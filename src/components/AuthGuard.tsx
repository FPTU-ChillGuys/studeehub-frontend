"use client";

import React, { useEffect, useState } from "react";
import { isAdmin } from "@/features/auth/api/auth";
import { useSession } from "next-auth/react";

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
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    setLoading(false);

    // Redirect if auth required but not authenticated
    if (requireAuth && !session) {
      window.location.href = "/";
      return;
    }

    // Redirect if admin required but not admin
    if (requireAdmin && !isAdmin(session?.user)) {
      window.location.href = "/user/my-documents";
      return;
    }
  }, [requireAuth, requireAdmin, session]);

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
    ((requireAuth && !session) || (requireAdmin && !isAdmin(session?.user)))
  ) {
    return <>{fallback}</>;
  }

  // Don't render if auth required but not met
  if (requireAuth && !session) {
    return null;
  }

  // Don't render if admin required but not met
  if (requireAdmin && !isAdmin(session?.user)) {
    return null;
  }

  return <>{children}</>;
}
