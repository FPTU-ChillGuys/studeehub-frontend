import { apiClient } from "@/lib/api/client";
import { FeedbackData, FeedbackResponse, Feedback } from "@/Types/feedback";

interface FeedbackFilters {
  pageNumber?: number;
  pageSize?: number;
  rating?: number;
  category?: number;
  status?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

interface FeedbacksResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: Feedback[];
}

class FeedbackService {
  async submitFeedback(data: FeedbackData): Promise<FeedbackResponse> {
    try {
      const formData = new FormData();
      formData.append("category", data.category.toString());
      formData.append("rating", data.rating.toString());
      formData.append("title", data.title);
      formData.append("message", data.message);

      // Add files if provided
      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append(`files`, file);
        });
      }

      const response = await apiClient.postWithFormData<unknown>(
        "/feedbacks",
        formData,
      );

      return {
        success: response.success,
        message: response.success
          ? "Feedback submitted successfully!"
          : "Failed to submit feedback",
        data: response.data,
      };
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw error;
    }
  }

  async getUserFeedbacks(filters: FeedbackFilters): Promise<FeedbacksResponse> {
    try {
      // Build params object, only including non-null/non-undefined values
      const params: Record<string, string | number | boolean> = {};
      if (filters.pageNumber !== undefined) params.pageNumber = filters.pageNumber;
      if (filters.pageSize !== undefined) params.pageSize = filters.pageSize;
      if (filters.rating !== undefined) params.rating = filters.rating;
      if (filters.category !== undefined) params.category = filters.category;
      if (filters.status !== undefined) params.status = filters.status;
      if (filters.sortBy !== undefined) params.sortBy = filters.sortBy;
      if (filters.sortDescending !== undefined) params.sortDescending = filters.sortDescending;

      const response = await apiClient.get<FeedbacksResponse>(
        "/feedbacks/user",
        {
          params,
        }
      );
      if (response.success) {
        return response.data as FeedbacksResponse;
      }
      return {
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        data: [],
      };
    } catch (error) {
      console.error("Error fetching user feedbacks:", error);
      throw error;
    }
  }
}

const feedbackService = new FeedbackService();
export default feedbackService;