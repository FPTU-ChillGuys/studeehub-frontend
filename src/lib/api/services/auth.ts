import { apiClient } from '../client';
import { AuthResponse, LoginRequest, User } from '../client';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<{ user: User; tokens: AuthResponse }> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Set access token for future requests
    apiClient.setToken(response.data.accessToken);
    
    // Store refresh token
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    // Decode JWT to get user info (simple decode without verification)
    const user = this.decodeToken(response.data.accessToken);
    
    return {
      user,
      tokens: response.data
    };
  }

  static getCurrentUser(): User | null {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      
      return this.decodeToken(token);
    } catch {
      console.error('Error getting current user');
      return null;
    }
  }

  static async logout(): Promise<void> {
    try {
      // Call logout API if available
      // await apiClient.post('/auth/logout');
    } finally {
      // Clear tokens regardless of API response
      apiClient.clearToken();
    }
  }

  // Simple JWT decode (client-side only, not for verification)
  private static decodeToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      return {
        id: payload.id || payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0], // Fallback name
        role: payload.role || 'user',
      };
    } catch {
      throw new Error('Invalid token format');
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() > expiry;
    } catch {
      return true; // Consider invalid tokens as expired
    }
  }

  // Refresh token if needed
  static async refreshTokenIfNeeded(): Promise<string | null> {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      return null;
    }

    // Check if token is expired or will expire in 5 minutes
    if (!this.isTokenExpired(accessToken)) {
      return accessToken; // Token is still valid
    }

    try {
      // Call refresh endpoint (adjust based on your API)
      const response = await apiClient.post<AuthResponse>('/auth/refresh', {
        refreshToken
      });

      // Update stored tokens
      apiClient.setToken(response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      return response.data.accessToken;
    } catch {
      // Refresh failed, clear tokens and redirect to login
      apiClient.clearToken();
      window.location.href = '/';
      return null;
    }
  }
}