import { ApiError, ApiErrorResponse } from "@/Types";

// API response wrapper từ backend
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors: string[] | null;
  errorType: number;
}

// API Client class
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7114/api";

class APIClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.accessToken = this.getTokenFromStorage();
  }

  private getTokenFromStorage(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  setToken(token: string) {
    this.accessToken = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
  }

  clearToken() {
    this.accessToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.accessToken && {
          Authorization: `Bearer ${this.accessToken}`,
        }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log("Making API request to:", url);
      console.log("Request config:", config);

      const response = await fetch(url, config);
      console.log("Response received:", response.status, response.statusText);

      // Check if response is ok
      if (!response.ok) {
        console.error(`HTTP Error: ${response.status} ${response.statusText}`);

        const errorData: ApiErrorResponse = await response.json();
        
        if (response.status === 401) {
          this.clearToken();
          window.location.href = "/";
        }

        throw new ApiError(response, {
          ...errorData
        });
      }

      const data: APIResponse<T> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      console.error("Request details:", { url, config });

      // If it's a fetch error (network), provide more details
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        console.error("Network error details:", {
          errorMessage: error.message,
          errorStack: error.stack,
          targetUrl: url,
          isHttps: url.startsWith("https://"),
          isCrossOrigin: !url.startsWith(window.location.origin),
        });
        throw new Error(
          `Network error: Unable to connect to ${url}. This might be due to CORS policy, SSL certificate issues, or the API server not running.`
        );
      }

      throw error;
    }
  }

  // HTTP methods
  async get<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

export const apiClient = new APIClient(API_BASE_URL);
