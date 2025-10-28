"use client";

import React, { useState } from "react";
import { loginWithGoogle } from "@/features/auth/api/auth";
import { Loader2, Eye, EyeOff, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthService } from "@/service/authService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { X, AlertCircle } from "lucide-react";
import { ErrorDisplay } from "./ui/error-display";

interface LoginFormProps extends React.ComponentProps<"div"> {
  onLogin?: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }> | void;
  onSignUp?: (
    email: string,
    password: string,
    fullName: string,
    userName: string
  ) => Promise<{ success: boolean; message?: string }> | void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function LoginForm({
  className,
  onLogin,
  onSignUp,
  onClose,
  showCloseButton = false,
  ...props
}: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    userName: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<{success: boolean; message?: string} | null>(null);

  // useEffect cho validation realtime
  React.useEffect(() => {
    if (isSignUp && formData.confirmPassword && formData.password) {
      const timeoutId = setTimeout(() => {
        if (formData.password !== formData.confirmPassword) {
          setConfirmPasswordError("Passwords don't match");
        } else {
          setConfirmPasswordError("");
        }
        setIsTyping(false);
      }, 500); // Đợi 500ms sau khi user ngừng nhập

      return () => clearTimeout(timeoutId);
    } else {
      setConfirmPasswordError("");
    }
  }, [formData.password, formData.confirmPassword, isSignUp]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Nếu đang nhập confirmPassword, set isTyping = true
    if (name === "confirmPassword" || name === "password") {
      setIsTyping(true);
      setConfirmPasswordError(""); // Xóa error khi đang nhập
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Kiểm tra có lỗi validation không
        if (confirmPasswordError) {
          setError(confirmPasswordError);
          setIsLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords don't match!");
          setIsLoading(false);
          return;
        }
        if (!formData.userName.trim()) {
          setError("Username is required");
          setIsLoading(false);
          return;
        }
        
        const result = await onSignUp?.(
          formData.email,
          formData.password,
          formData.fullName,
          formData.userName
        );
        
        if (result) {
          if (result.success) {
            setRegistrationSuccess({ success: true, message: result.message });
          } else if (result.message) {
            setError(result.message);
          }
        }
      } else {
        const result = await onLogin?.(formData.email, formData.password);
        if (result?.message) {
          setError(result.message);
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setRegistrationSuccess(null);
    setForgotPasswordMode(false);
    setResetEmailSent(false);
    setIsSignUp(!isSignUp);
    setFormData({
      email: "",
      password: "",
      fullName: "",
      userName: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    // Reset validation states
    setConfirmPasswordError("");
    setIsTyping(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }

    setIsResetting(true);
    try {
      const resetUrl = `${window.location.origin}/auth/reset-password`;
      const request = {
        email: formData.email,
        clientUri: resetUrl,
      };

      // Call the auth service to send reset password email
      const response = await AuthService.forgotPassword(request);
      if (response.token) {
        setResetEmailSent(true);
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      setError(error instanceof Error ? error.message : "Failed to send reset email. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleBackToLogin = () => {
    setForgotPasswordMode(false);
    setResetEmailSent(false);
    setError(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-2xl mx-auto", className)}
      {...props}
    >
      <Card className="relative w-full">
        {/* Close Button */}
        {!registrationSuccess && showCloseButton && onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 z-10"
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        {/* Success Message */}
        {registrationSuccess ? (
          <div className="p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">
              Registration Successful!
            </h3>
            <div className="mt-2 text-sm text-gray-500">
              {registrationSuccess.message || 'Your account has been created successfully. You can now sign in.'}
            </div>
            <div className="mt-6">
              <Button
                onClick={() => {
                  setRegistrationSuccess(null);
                  toggleMode(); // Switch to login form
                }}
              >
                Back to Login
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Error Display */}
            {error && (
              <div className="px-6 pt-6">
                <ErrorDisplay error={error} />
              </div>
            )}

            <CardHeader>
              <CardTitle>
                {isSignUp ? "Create an account" : "Login to your account"}
              </CardTitle>
              <CardDescription>
                {isSignUp
                  ? "Enter your information to create your account"
                  : "Enter your email below to login to your account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {forgotPasswordMode ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {resetEmailSent ? "Check your email" : "Reset your password"}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {resetEmailSent 
                        ? `We've sent a password reset link to ${formData.email}. Please check your email.`
                        : "Enter your email address and we'll send you a link to reset your password."}
                    </p>
                  </div>

                  {!resetEmailSent && (
                    <>
                      <Field>
                        <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
                        <Input
                          id="forgot-email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </Field>

                      <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 pt-2 w-full">
                        <Button type="submit" className="w-full" disabled={isResetting}>
                          {isResetting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send Reset Link"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBackToLogin}
                          className="w-full"
                          disabled={isResetting}
                        >
                          Back to Login
                        </Button>
                      </div>
                    </>
                  )}

                  {resetEmailSent && (
                    <Button 
                      type="button" 
                      onClick={handleBackToLogin}
                      className="w-full mt-4"
                    >
                      Back to Login
                    </Button>
                  )}
                </form>
              ) : (
                <form onSubmit={handleSubmit}>
                <FieldGroup
                  className={
                    isSignUp ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"
                  }
                >
                  {isSignUp && (
                    <>
                      <Field className="md:col-span-2">
                        <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </Field>
                      <Field className="md:col-span-2">
                        <FieldLabel htmlFor="userName">
                          Username
                          <span className="text-xs text-muted-foreground ml-2">
                            (Your unique identifier)
                          </span>
                        </FieldLabel>
                        <Input
                          id="userName"
                          name="userName"
                          type="text"
                          placeholder="Choose a unique username"
                          value={formData.userName}
                          onChange={handleInputChange}
                          required
                        />
                      </Field>
                    </>
                  )}

                  <Field className={isSignUp ? "md:col-span-2" : ""}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Field>
                  <Field className={isSignUp ? "md:col-span-1" : ""}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={() => setForgotPasswordMode(true)}
                          className="ml-auto inline-block text-sm text-blue-600 underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </Field>

                  {isSignUp && (
                    <Field className="md:col-span-1">
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`pr-10 ${
                            confirmPasswordError
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      {confirmPasswordError && !isTyping && (
                        <FieldDescription className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {confirmPasswordError}
                        </FieldDescription>
                      )}
                    </Field>
                  )}

                  <Field className={isSignUp ? "md:col-span-2" : ""}>
                    <Button
                      type="submit"
                      disabled={
                        isLoading || (isSignUp && confirmPasswordError !== "")
                      }
                      className="w-full"
                    >
                      {isLoading
                        ? "Loading..."
                        : isSignUp
                        ? "Create Account"
                        : "Login"}
                    </Button>

                    <Button
                      variant="outline"
                      type="button"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => {
                        setIsLoading(true);
                        loginWithGoogle().finally(() => setIsLoading(false));
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Please wait...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                          {isSignUp ? "Sign up" : "Login"} with Google
                        </>
                      )}
                    </Button>

                    <FieldDescription
                      className={`text-center ${isSignUp ? "md:col-span-2" : ""}`}
                    >
                      {isSignUp ? (
                        <>
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={toggleMode}
                            className="underline underline-offset-4 hover:text-primary"
                          >
                            Sign in
                          </button>
                        </>
                      ) : (
                        <>
                          Don&apos;t have an account?{" "}
                          <button
                            type="button"
                            onClick={toggleMode}
                            className="underline underline-offset-4 hover:text-primary"
                          >
                            Sign up
                          </button>
                        </>
                      )}
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
