import { apiClient } from "@/lib/api/client";
import { UserMetricsResponse } from "../";

export async function getUserMetrics(): Promise<UserMetricsResponse> {
  const response = await apiClient.get<UserMetricsResponse>("/users/metrics");

  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch user metrics');
  }
  
  return response.data;
}
