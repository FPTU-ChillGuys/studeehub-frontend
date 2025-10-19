import { apiClient } from "@/lib/api/client";
import { StreakResponse, UpdateStreakRequest } from "@/Types";

class StreakService {
  /**
   * Update user streak (automatically increments if conditions met)
   * @param userId - User ID
   * @param data - Streak update data
   */
  async updateStreak(
    userId: string,
    data: UpdateStreakRequest = { type: 1, isActive: true }
  ): Promise<StreakResponse> {
    try {
      const response = await apiClient.put<StreakResponse>(
        `/users/${userId}/streaks`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("[StreakService] Error updating streak:", error);
      throw error;
    }
  }

  /**
   * Get user streaks by type
   * @param userId - User ID
   * @param type - Streak type (default: 1 for login streaks)
   */
  async getStreaks(userId: string, type: number = 1): Promise<StreakResponse> {
    try {
      const response = await apiClient.get<StreakResponse>(
        `/users/${userId}/streaks`,
        {
          params: { type },
        }
      );
      return response.data;
    } catch (error) {
      console.error("[StreakService] Error fetching streaks:", error);
      throw error;
    }
  }
}

const streakService = new StreakService();
export default streakService;
