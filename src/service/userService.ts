import { User, UserMetrics } from "@/features/admin";
import { apiClient } from "@/lib/api/client";
import { UserProfile, PaginatedResponse } from "@/Types";

interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
  searchTerm?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

class UserService {
  /**
   * Get user profile by ID
   * @param userId - User ID
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>(
        `/users/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("[UserService] Error fetching user profile:", error);
      throw error;
    }
  }

  /**
   * Get all users with pagination and filtering
   */
  async getUsers(params: PaginationParams = {}): Promise<PaginatedResponse<User[]>> {
    try {
      const response = await apiClient.get<User[], PaginatedResponse<User[]>>('/users', { params });
      return response;
    } catch (error) {
      console.error("[UserService] Error fetching users:", error);
      throw error;
    }
  }

  /**
   * Get user metrics
   */
  async getUserMetrics(): Promise<UserMetrics> {
    try {
      const response = await apiClient.get<UserMetrics>('/users/metrics');
      return response.data;
    } catch (error) {
      console.error("[UserService] Error fetching user metrics:", error);
      throw error;
    }
  }

  /**
   * Update user status
   */
  async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<void> {
    try {
      await apiClient.put(`/users/${userId}/status`, { status });
    } catch (error) {
      console.error(`[UserService] Error updating user status for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      await apiClient.delete(`/users/${userId}`);
    } catch (error) {
      console.error(`[UserService] Error deleting user ${userId}:`, error);
      throw error;
    }
  }
}

const userService = new UserService();
export default userService;
