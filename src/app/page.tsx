"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import HomePage from "@/components/HomePage";
import { redirectBasedOnRole } from "@/features/auth";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const userRole = session?.user;
      redirectBasedOnRole(userRole);
    }
  }, [status, session]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  // Only show the home page if user is not authenticated
  return <HomePage />;
}
