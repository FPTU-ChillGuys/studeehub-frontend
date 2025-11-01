import { apiClient } from "@/lib/api/client";
import { Metrics, UserMetrics } from "../";

export async function getUserMetrics(): Promise<Metrics> {
  const response = await apiClient.get<Metrics>("/metrics/admin/metrics");

  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch user metrics');
  }
  
  return response.data;
}

export async function getUserMetricsById(userId: string, period: 'day' | 'week' | 'month' | 'year'): Promise<UserMetrics> {
  const response = await apiClient.get<UserMetrics>(`/metrics/user/${userId}/metrics?period=${period}`);

  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch user metrics');
  }
  
  return response.data;
}

