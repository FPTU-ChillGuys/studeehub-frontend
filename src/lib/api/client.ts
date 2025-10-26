import { ApiError, ApiErrorResponse } from "@/Types";
import { getSession } from "next-auth/react";

// API response wrapper từ backend
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors: string[] | null;
  errorType: number;
}

// API Client class
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Validate API_BASE_URL at module load time
if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not defined. Please set it in your .env.local file."
  );
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async getToken(): Promise<string | null> {
    const session = await getSession();
    if (session?.accessToken) {
      return session.accessToken;
    }
    return null;
  }

  private async request<R extends APIResponse<T>, T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<R> {
    const url = `${this.baseURL}${endpoint}`;
    const accessToken = await this.getToken();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && {
          Authorization: `Bearer ${accessToken}`,
        }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Check if response is ok
      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();

        if (response.status === 401) {
          window.location.href = "/";
        }

        throw new ApiError(response, {
          ...errorData,
        });
      }

      const data: R = await response.json();

      if (!data.success) {
        throw new Error(data.message || "API request failed");
      }

      return data;
    } catch (error) {
      // If it's a fetch error (network), provide more details
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        throw new Error(
          `Network error: Unable to connect to ${url}. This might be due to CORS policy, SSL certificate issues, or the API server not running.`
        );
      } else {
        throw error;
      }
    }
  }

  // HTTP methods
  async get<T, R extends APIResponse<T> = APIResponse<T>>(
    endpoint: string, 
    options?: { params?: Record<string, string | number | boolean> }
  ): Promise<R> {
    let url = endpoint;
    
    // Add query parameters if provided
    if (options?.params) {
      const queryString = new URLSearchParams(
        Object.entries(options.params).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      
      if (queryString) {
        url = `${endpoint}?${queryString}`;
      }
    }
    
    return this.request<R, T>(url);
  }

  async post<T, R extends APIResponse<T> = APIResponse<T>>(
    endpoint: string, 
    data?: unknown
  ): Promise<R> {
    return this.request<R, T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T, R extends APIResponse<T> = APIResponse<T>>(
    endpoint: string, 
    data?: unknown
  ): Promise<R> {
    return this.request<R, T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T, R extends APIResponse<T> = APIResponse<T>>(
    endpoint: string, 
    data?: unknown
  ): Promise<R> {
    console.log("Data", data);
    
    return this.request<R, T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T, R extends APIResponse<T> = APIResponse<T>>(
    endpoint: string
  ): Promise<R> {
    return this.request<R, T>(endpoint, {
      method: "DELETE"
    });
  }
}

export const apiClient = new APIClient(API_BASE_URL);
