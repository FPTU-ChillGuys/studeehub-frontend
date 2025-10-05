"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import {
  authenticateUser,
  setCurrentUser,
  redirectBasedOnRole,
} from "@/lib/auth";

export default function Page() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log("Login attempt:", { email, password });
      const user = await authenticateUser(email, password);

      if (user) {
        setCurrentUser(user);
        redirectBasedOnRole(user);
      } else {
        alert(
          "Invalid email or password. Try:\n- admin@studeehub.com / admin123\n- user@studeehub.com / user123"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      console.log("Sign up attempt:", { email, password, name });

      // For demo, create a new user account (normally would call API)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        role: "user" as const,
      };

      setCurrentUser(newUser);
      redirectBasedOnRole(newUser);
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Sign up failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onLogin={handleLogin} onSignUp={handleSignUp} />
      </div>
    </div>
  );
}
