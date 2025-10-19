import { apiClient } from "@/lib/api/client";
import { UserProfileResponse } from "@/Types";

class UserService {
  /**
   * Get user profile by ID
   * @param userId - User ID
   */
  async getUserProfile(userId: string): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.get<UserProfileResponse>(
        `/users/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("[UserService] Error fetching user profile:", error);
      throw error;
    }
  }
}

const userService = new UserService();
export default userService;
