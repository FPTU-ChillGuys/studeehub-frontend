import { apiClient } from "@/lib/api/client";

export interface ScheduleItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  isCheckin?: boolean;
  checkInTime?: string;
  reminderMinutesBefore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleResponse {
  data: ScheduleItem[];
  success: boolean;
  message: string;
  errors: string[] | null;
  errorType: number;
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

class ScheduleService {
  /**
   * Get user schedules with pagination and sorting
   * @param userId - User ID
   * @param pageNumber - Page number (default: 1)
   * @param pageSize - Items per page (default: 10)
   * @param sortBy - Field to sort by (default: "startTime")
   * @param sortDescending - Sort order (default: false)
   */
  async getUserSchedules(
    userId: string,
    pageNumber: number = 1,
    pageSize: number = 10,
    sortBy: string = "startTime",
    sortDescending: boolean = false
  ): Promise<ScheduleResponse> {
    try {
      const response = await apiClient.get<ScheduleResponse>(
        `/users/${userId}/schedules`,
        {
          params: {
            PageNumber: pageNumber,
            PageSize: pageSize,
            SortBy: sortBy,
            SortDescending: sortDescending.toString(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("[ScheduleService] Error fetching schedules:", error);
      throw error;
    }
  }

  /**
   * Create a new schedule
   * @param userId - User ID
   * @param scheduleData - Schedule data
   */
  async createSchedule(
    userId: string,
    scheduleData: Omit<ScheduleItem, "id" | "createdAt" | "updatedAt">
  ): Promise<ScheduleResponse> {
    try {
      const response = await apiClient.post<ScheduleResponse>(
        `/users/${userId}/schedules`,
        scheduleData
      );
      return response.data;
    } catch (error) {
      console.error("[ScheduleService] Error creating schedule:", error);
      throw error;
    }
  }

  /**
   * Update an existing schedule
   * @param userId - User ID
   * @param scheduleId - Schedule ID
   * @param scheduleData - Updated schedule data
   */
  async updateSchedule(
    userId: string,
    scheduleId: string,
    scheduleData: Partial<ScheduleItem>
  ): Promise<ScheduleResponse> {
    try {
      const response = await apiClient.put<ScheduleResponse>(
        `/users/${userId}/schedules/${scheduleId}`,
        scheduleData
      );
      return response.data;
    } catch (error) {
      console.error("[ScheduleService] Error updating schedule:", error);
      throw error;
    }
  }

  /**
   * Delete a schedule
   * @param userId - User ID
   * @param scheduleId - Schedule ID
   */
  async deleteSchedule(userId: string, scheduleId: string): Promise<ScheduleResponse> {
    try {
      const response = await apiClient.delete<ScheduleResponse>(
        `/users/${userId}/schedules/${scheduleId}`
      );
      return response.data;
    } catch (error) {
      console.error("[ScheduleService] Error deleting schedule:", error);
      throw error;
    }
  }

  /**
   * Check in to a schedule
   * @param userId - User ID
   * @param scheduleId - Schedule ID
   */
  async checkInSchedule(userId: string, scheduleId: string): Promise<ScheduleResponse> {
    try {
      const response = await apiClient.post<ScheduleResponse>(
        `/users/${userId}/schedules/${scheduleId}/checkin`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error("[ScheduleService] Error checking in schedule:", error);
      throw error;
    }
  }
}

const scheduleService = new ScheduleService();
export default scheduleService;
