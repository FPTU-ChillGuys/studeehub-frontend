import { apiClient } from "@/lib/api/client";

export interface PomodoroSettings {
  userId: string;
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartNext: boolean;
}

export interface UpdatePomodoroSettingsRequest {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartNext: boolean;
}

class PomodoroService {
  /**
   * Get user's Pomodoro settings
   * @param userId - User ID
   */
  async getSettings(userId: string): Promise<PomodoroSettings> {
    try {
      const response = await apiClient.get<PomodoroSettings>(
        `/users/${userId}/pomodoro/settings`
      );
      return response.data;
    } catch (error) {
      console.error("[PomodoroService] Error fetching settings:", error);
      // Return default settings if fetch fails
      return {
        userId,
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
        autoStartNext: false,
      };
    }
  }

  /**
   * Update user's Pomodoro settings
   * @param userId - User ID
   * @param settings - Updated settings
   * @returns Success message or throws error
   */
  async updateSettings(
    userId: string,
    settings: UpdatePomodoroSettingsRequest
  ): Promise<void> {
    try {
      // Validate settings before sending
      if (
        !settings.workDuration ||
        settings.workDuration < 1 ||
        settings.workDuration > 60
      ) {
        throw new Error("Invalid workDuration");
      }
      if (
        !settings.shortBreakDuration ||
        settings.shortBreakDuration < 1 ||
        settings.shortBreakDuration > 30
      ) {
        throw new Error("Invalid shortBreakDuration");
      }
      if (
        !settings.longBreakDuration ||
        settings.longBreakDuration < 1 ||
        settings.longBreakDuration > 60
      ) {
        throw new Error("Invalid longBreakDuration");
      }
      if (
        !settings.longBreakInterval ||
        settings.longBreakInterval < 1 ||
        settings.longBreakInterval > 10
      ) {
        throw new Error("Invalid longBreakInterval");
      }

      await apiClient.put<string>(
        `/users/${userId}/pomodoro/settings`,
        settings
      );
    } catch (error) {
      console.error("[PomodoroService] Error updating settings:", error);
      throw error;
    }
  }
}

const pomodoroService = new PomodoroService();
export default pomodoroService;
