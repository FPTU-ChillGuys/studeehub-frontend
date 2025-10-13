import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/api/services/auth";
import {
  authenticateUser,
  setCurrentUser,
  redirectBasedOnRole,
  User,
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
        return { success: false, error: "Invalid email or password!" };
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

        return { success: false, error: errorMessage };
      }

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return { success: false, error: errorMessage };
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

      if (result.success) {
        // If user data is returned (auto-login case)
        if (result.user) {
          setCurrentUser(result.user);
          redirectBasedOnRole(result.user);
          return { success: true, message: result.message };
        } else {
          // Registration successful but need manual login
          return { success: true, error: result.message };
        }
      } else {
        return { success: false, error: result.message };
      }
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

        return { success: false, error: errorMessage };
      }

      // Handle regular Error (like token decoding errors)
      if (error instanceof Error) {
        if (error.message.includes("missing authentication tokens")) {
          return {
            success: false,
            error:
              "Registration successful! Please check your email and then login to your account.",
          };
        } else if (error.message.includes("Invalid token format")) {
          return {
            success: false,
            error:
              "Registration completed but there was an issue with authentication. Please try logging in.",
          };
        } else {
          return { success: false, error: error.message };
        }
      }

      return { success: false, error: errorMessage };
    }
  };

  return {
    login: handleLogin,
    signUp: handleSignUp,
  };
}
