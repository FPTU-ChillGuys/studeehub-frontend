import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/api/services/auth";
import {
  authenticateUser,
  setCurrentUser,
  redirectBasedOnRole,
} from "@/lib/auth";
import { ApiError } from "@/Types";

export function useAuth() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await authenticateUser(email, password);

      if (user) {
        setCurrentUser(user);
        redirectBasedOnRole(user);
        return { success: true };
      } else {
        return { success: false, message: "Invalid email or password!" };
      }
    } catch (error) {
      if (error instanceof ApiError) {
        let errorMessage = error.message;

        if (error.status === 400 && error.data?.errors) {
          const errors = error.data.errors;
          if (Array.isArray(errors)) {
            errorMessage = errors.join("\n");
          } else if (typeof errors === "object") {
            errorMessage = Object.entries(errors)
              .map(([field, messages]) => {
                const fieldName =
                  field.charAt(0).toUpperCase() + field.slice(1);
                const messageList = Array.isArray(messages)
                  ? messages.join(", ")
                  : String(messages);
                return `${fieldName}: ${messageList}`;
              })
              .join("\n");
          }
        }

        return { success: false, message: errorMessage };
      }

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return { success: false, message: errorMessage };
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    fullName: string,
    userName: string
  ) => {
    try {
      const result = await AuthService.register({
        email,
        password,
        fullName,
        userName,
      });

      return { success: result.success, message: result.message };
    } catch (error) {
      const errorMessage = "Sign up failed. Please try again.";

      if (error instanceof ApiError) {
        let errorMessage = error.message;

        if (error.status === 400 && error.data?.errors) {
          const errors = error.data.errors;
          if (Array.isArray(errors)) {
            errorMessage = errors.join("\n");
          } else if (typeof errors === "object") {
            errorMessage = Object.entries(errors)
              .map(([field, messages]) => {
                const fieldName =
                  field.charAt(0).toUpperCase() + field.slice(1);
                const messageList = Array.isArray(messages)
                  ? messages.join(", ")
                  : String(messages);
                return `${fieldName}: ${messageList}`;
              })
              .join("\n");
          }
        }

        return { success: false, message: errorMessage };
      }

      // Handle regular Error (like token decoding errors)
      if (error instanceof Error) {
        if (error.message.includes("missing authentication tokens")) {
          return {
            success: false,
            message:
              "Registration successful! Please check your email and then login to your account.",
          };
        } else if (error.message.includes("Invalid token format")) {
          return {
            success: false,
            message:
              "Registration completed but there was an issue with authentication. Please try logging in.",
          };
        } else {
          return { success: false, message: error.message };
        }
      }

      return { success: false, message: errorMessage };
    }
  };

  return {
    login: handleLogin,
    signUp: handleSignUp,
  };
}
