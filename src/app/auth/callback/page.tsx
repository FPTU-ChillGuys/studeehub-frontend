"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { redirectBasedOnRole } from "@/features/auth";
import { AuthUser } from "@/Types";

export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (status === "unauthenticated") {
      // Not signed in, redirect to login
      router.push("/");
      return;
    }

    if (session?.user) {
      // Successfully signed in, create user object and redirect
      const user: AuthUser = {
        id: session.user.id || "",
        email: session.user.email || "",
        role: (session.user.role as "user" | "admin") || "user",
      };

      redirectBasedOnRole(user);
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4">Signing you in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p>Redirecting...</p>
      </div>
    </div>
  );
}
