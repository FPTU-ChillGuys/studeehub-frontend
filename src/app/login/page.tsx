"use client";

import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const { login, signUp } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    return result;
  };

  const handleSignUp = async (
    email: string,
    password: string,
    fullName: string,
    userName: string
  ) => {
    const result = await signUp(email, password, fullName, userName);
    return result;
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onLogin={handleLogin} onSignUp={handleSignUp} />
      </div>
    </div>
  );
}
