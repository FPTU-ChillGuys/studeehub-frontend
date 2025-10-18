import { User } from "@/Types";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  //expiresIn: number;
  //tokenType: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  userName: string;
  // Add any additional registration fields here
}

export interface RegisterRequestWithClientUri extends RegisterRequest {
  clientUri: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface GoogleAuthResponse extends AuthResponse {}

export interface AuthError extends Error {
  status?: number;
  data?: {
    message?: string;
    errors?: Record<string, string[]> | string[];
    [key: string]: any;
  };
}
