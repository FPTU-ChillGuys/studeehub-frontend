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
  data: ScheduleItem | ScheduleItem[] | string;
  success: boolean;
  message: string;
  errors: string[] | null;
  errorType: number;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface CreateScheduleRequest {
  userId: string;
  title: string;
  startTime: string;
  endTime: string;
  reminderMinutesBefore?: number;
  description?: string;
}

export interface UpdateScheduleRequest {
  title?: string;
  startTime?: string;
  endTime?: string;
  reminderMinutesBefore?: number;
  description?: string;
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
      // API returns data directly as array, wrap it in ScheduleResponse format
      return {
        success: true,
        message: "Success",
        errors: null,
        errorType: 0,
        data: response.data as unknown as ScheduleItem[],
        totalCount: (response.data as any)?.totalCount || 0,
        page: (response.data as any)?.page || 1,
        pageSize: (response.data as any)?.pageSize || 10,
        totalPages: (response.data as any)?.totalPages || 0
      };
    } catch (error) {
      console.error("[ScheduleService] Error fetching schedules:", error);
      throw error;
    }
  }

  /**
   * Get a specific schedule by ID
   * @param scheduleId - Schedule ID
   */
  async getScheduleById(scheduleId: string): Promise<ScheduleResponse> {
    try {
      const response = await apiClient.get<ScheduleResponse>(
        `/schedules/${scheduleId}`
      );
      return response.data;
    } catch (error) {
      console.error("[ScheduleService] Error fetching schedule:", error);
      throw error;
    }
  }

  /**
   * Create a new schedule
   * @param scheduleData - Schedule data
   */
  async createSchedule(scheduleData: CreateScheduleRequest): Promise<ScheduleResponse> {
    try {
      const response = await apiClient.post<ScheduleResponse>(
        `/schedules`,
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
   * @param scheduleId - Schedule ID
   * @param scheduleData - Updated schedule data
   */
  async updateSchedule(
    scheduleId: string,
    scheduleData: UpdateScheduleRequest
  ): Promise<ScheduleResponse> {
    try {
      const response = await apiClient.put<ScheduleResponse>(
        `/schedules/${scheduleId}`,
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
   * @param scheduleId - Schedule ID
   */
  async deleteSchedule(scheduleId: string): Promise<ScheduleResponse> {
    try {
      const response = await apiClient.delete<ScheduleResponse>(
        `/schedules/${scheduleId}`
      );
      return response.data;
    } catch (error) {
      console.error("[ScheduleService] Error deleting schedule:", error);
      throw error;
    }
  }

  /**
   * Check in to a schedule
   * @param scheduleId - Schedule ID
   */
  async checkInSchedule(scheduleId: string): Promise<ScheduleResponse> {
    try {
      const response = await apiClient.patch<ScheduleResponse>(
        `/schedules/${scheduleId}/checkin`,
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
