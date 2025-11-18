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
          formData.append("files", file);
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
        return response as unknown as FeedbacksResponse;
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

  async getFeedbacks(filters: FeedbackFilters): Promise<FeedbacksResponse> {
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
        "/feedbacks",
        {
          params,
        }
      );
      if (response.success) {
        return response as unknown as FeedbacksResponse;
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

  async getFeedbackDetail(feedbackId: string): Promise<Feedback> {
    try {
      const response = await apiClient.get<Feedback>(
        `/feedbacks/${feedbackId}`
      );
      if (response.success) {
        return response.data as Feedback;
      }
      throw new Error("Failed to fetch feedback detail");
    } catch (error) {
      console.error("Error fetching feedback detail:", error);
      throw error;
    }
  }

  async respondToFeedback(
    feedbackId: string,
    response: string,
    status: number
  ): Promise<boolean> {
    try {
      const result = await apiClient.put<unknown>(
        `/feedbacks/${feedbackId}/response`,
        { response, status }
      );
      return result.success;
    } catch (error) {
      console.error("Error responding to feedback:", error);
      throw error;
    }
  }

  async updateFeedbackResponse(
    feedbackId: string,
    response: string,
    status: number
  ): Promise<boolean> {
    try {

      console.log("Updating feedback response:", { feedbackId, response, status });

      const result = await apiClient.put<unknown>(
        `/feedbacks/${feedbackId}/response`,
        { response, status }
      );
      return result.success;
    } catch (error) {
      console.error("Error updating feedback response:", error);
      throw error;
    }
  }

  async deleteFeedback(feedbackId: string): Promise<boolean> {
    try {
      const result = await apiClient.delete<unknown>(
        `/feedbacks/${feedbackId}/soft`
      );
      return result.success;
    } catch (error) {
      console.error("Error deleting feedback:", error);
      throw error;
    }
  }

  async editFeedback(
    feedbackId: string,
    data: {
      category: number;
      rating: number;
      title: string;
      message: string;
      keepAttachmentIds?: string[];
      files?: File[];
    }
  ): Promise<FeedbackResponse> {
    try {
      const formData = new FormData();
      formData.append("category", data.category.toString());
      formData.append("rating", data.rating.toString());
      formData.append("title", data.title);
      formData.append("message", data.message);

      // Add keep attachment IDs
      if (data.keepAttachmentIds && data.keepAttachmentIds.length > 0) {
        data.keepAttachmentIds.forEach((id) => {
          formData.append("keepAttachmentIds", id);
        });
      }

      // Add new files if provided
      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await apiClient.putWithFormData<unknown>(
        `/feedbacks/${feedbackId}`,
        formData
      );

      return {
        success: response.success,
        message: response.success
          ? "Feedback updated successfully!"
          : "Failed to update feedback",
        data: response.data,
      };
    } catch (error) {
      console.error("Error editing feedback:", error);
      throw error;
    }
  }
}

const feedbackService = new FeedbackService();
export default feedbackService;