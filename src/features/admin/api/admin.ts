import { apiClient } from "@/lib/api/client";
import { UserMetrics } from "../";

export async function getUserMetrics(): Promise<UserMetrics> {
  const response = await apiClient.get<UserMetrics>("/metrics/admin/metrics");

  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch user metrics');
  }
  
  return response.data;
}
