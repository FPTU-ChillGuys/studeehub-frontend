export interface UserMetricsResponse {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersCount: number;
  growthRatePercent: number;
  payingUserRatio: number;
  usersBySubscription: Record<string, number>;
  averageSessionsPerUser: number;
}
