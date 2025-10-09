import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/api/services/auth";
import { 
  authenticateUser, 
  setCurrentUser, 
  redirectBasedOnRole, 
  User 
} from "@/lib/auth";
import { ApiError } from "@/Types";

export function useAuth() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log("Login attempt:", { email });
      const user = await authenticateUser(email, password);

      if (user) {
        setCurrentUser(user);
        redirectBasedOnRole(user);
        return { success: true };
      } else {
        return { success: false, error: "Invalid email or password!" };
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error instanceof ApiError) {
        console.error('API Error details:', {
          status: error.status,
          data: error.data,
          message: error.message
        });

        let errorMessage = error.message;
        
        if (error.status === 400 && error.data?.errors) {
          const errors = error.data.errors;
          if (Array.isArray(errors)) {
            errorMessage = errors.join('\n');
          } else if (typeof errors === 'object') {
            errorMessage = Object.entries(errors)
              .map(([field, messages]) => {
                const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                const messageList = Array.isArray(messages) ? messages.join(', ') : String(messages);
                return `${fieldName}: ${messageList}`;
              })
              .join('\n');
          }
        }
        
        return { success: false, error: errorMessage };
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
        
      return { success: false, error: errorMessage };
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string, userName: string) => {
    try {
      console.log("Sign up attempt:", { email, fullName, userName });
      
      const { user } = await AuthService.register({
        email,
        password,
        fullName,
        userName
      });

      setCurrentUser(user);
      redirectBasedOnRole(user);
      return { success: true };
    } catch (error) {
      console.error("Sign up error:", error);
      let errorMessage = "Sign up failed. Please try again.";
      
      if (error instanceof ApiError) {
        console.error('API Error details:', {
          status: error.status,
          data: error.data,
          message: error.message
        });

        let errorMessage = error.message;
        
        if (error.status === 400 && error.data?.errors) {
          const errors = error.data.errors;
          if (Array.isArray(errors)) {
            errorMessage = errors.join('\n');
          } else if (typeof errors === 'object') {
            errorMessage = Object.entries(errors)
              .map(([field, messages]) => {
                const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                const messageList = Array.isArray(messages) ? messages.join(', ') : String(messages);
                return `${fieldName}: ${messageList}`;
              })
              .join('\n');
          }
        }
        
        return { success: false, error: errorMessage };
      }
      
      return { success: false, error: errorMessage };
    }
  };

  return {
    login: handleLogin,
    signUp: handleSignUp,
  };
}
