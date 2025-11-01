export interface MonthlyUserCount {
  month: string;
  year: number;
  count: number;
}

export interface UserTrendSummary {
  currentStart: string;
  currentEnd: string;
  prevStart: string;
  prevEnd: string;
  currentNewUsers: number;
  prevNewUsers: number;
  growthRatePercent: number;
}

export interface MetricsResponse {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersCount: number;
  growthRatePercent: number;
  payingUserRatio: number;
  usersBySubscription: Record<string, number> | null;
  averageSessionsPerUser: number;
  monthlyGrowth: MonthlyUserCount[] | null;
  totalSchedules: number;
  averageSchedulesPerUser: number;
  totalStreaks: number;
  activeStreaks: number;
  averageStreakLength: number;
  totalAchievementsUnlocked: number;
  topAchievements: Record<string, number> | null;
  retention7DayPercent: number;
  retention30DayPercent: number;
  trend: UserTrendSummary;
}

export interface Metrics extends Omit<MetricsResponse, 'monthlyUserGrowth' | 'trendSummary'> {
  monthlyGrowth: MonthlyUserCount[];
  trend: UserTrendSummary;
}
