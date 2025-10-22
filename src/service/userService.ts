import { UserMetrics, UserUpdateData } from "@/features/admin";
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
  async getUsers(params: PaginationParams = {}): Promise<PaginatedResponse<UserProfile[]>> {
    try {
      const response = await apiClient.get<UserProfile[], PaginatedResponse<UserProfile[]>>('/users', { params: { ...params } });
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
  async updateUserStatus(userId: string, status: boolean): Promise<void> {
    try {
      await apiClient.patch(`/users/${userId}/update-status`, { status });
    } catch (error) {
      console.error(`[UserService] Error updating user status for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, data: UserUpdateData): Promise<string> {
    try {
      const response = await apiClient.put<string>(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error(`[UserService] Error updating user profile for ${userId}:`, error);
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
