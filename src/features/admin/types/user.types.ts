import { MetricsResponse } from "..";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'suspended';
  role: 'admin' | 'user' | 'moderator';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  subscriptionStatus?: string;
  subscriptionExpiryDate?: string;
}

export interface UserListFilters {
  status?: 'active' | 'inactive' | 'suspended';
  role?: string;
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: 'active' | 'inactive' | 'suspended';
  role?: 'admin' | 'user' | 'moderator';
}

export interface FocusChart {
  date: string;
  focusHours: number;
}

export interface UserMetrics {
  userId: string;
  fullName: string;
  subscriptionName: string;
  joinedAt: string;
  totalSessions: number;
  totalFocusHours: number;
  avgFocusPerDay: number;
  focusChart: FocusChart[];
  totalSchedules: number;
  completedSchedules: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  unlockedAchievements: number;
  recentAchievements: string[];
  activeDays: number;
  engagementRatePercent: number;
}
