"use client";

import React, { useEffect, useState } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { getUserMetrics } from "@/features/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { UserMetrics, MonthlyUserCount } from "@/features/admin/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';

export default function AdminPage() {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getUserMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to fetch metrics:', err);
        setError('Failed to load dashboard metrics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const renderStatCard = (title: string, value: number | string, isPercentage = false, description?: string) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {loading ? (
        <Skeleton className="h-8 w-20 mt-2" />
      ) : (
        <div>
          <p className="text-2xl font-bold">
            {typeof value === 'number' && isPercentage ? `${value.toFixed(1)}%` : value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}
    </div>
  );

  const renderTrendCard = (title: string, current: number, previous: number) => {
    const growth = previous ? ((current - previous) / previous) * 100 : 0;
    const isPositive = growth >= 0;
    
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {loading ? (
          <Skeleton className="h-8 w-20 mt-2" />
        ) : (
          <div>
            <p className="text-2xl font-bold">{current.toLocaleString()}</p>
            <div className={`flex items-center mt-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}% from previous period
            </div>
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercent = (num: number) => `${num.toFixed(1)}%`;
  
  const formatMonthYear = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'MMM yyyy');
    } catch {
      return dateStr;
    }
  };
  
  const prepareMonthlyData = (data: MonthlyUserCount[] = []) => {
    return data.map(item => ({
      ...item,
      monthYear: `${item.month} ${item.year}`,
      formattedDate: formatMonthYear(`${item.year}-${String(item.month).padStart(2, '0')}-01`)
    }));
  };
  return (
    <SidebarInset>
      <div className="w-full max-w-[calc(100vw-4rem)] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <div className="w-full">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="w-full space-y-8">
          <div className="w-full">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of platform metrics and statistics</p>
          </div>

          {/* User Metrics Section */}
          <div className="w-full space-y-4">
            <h2 className="text-2xl font-semibold">User Metrics</h2>
            <div className="w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {renderStatCard('Total Users', metrics?.totalUsers ? formatNumber(metrics.totalUsers) : '0')}
              {renderStatCard('Active Users', metrics?.activeUsers ? formatNumber(metrics.activeUsers) : '0', false, 'Logged in within last 30 days')}
              {renderStatCard('Inactive Users', metrics?.inactiveUsers ? formatNumber(metrics.inactiveUsers) : '0')}
              {renderStatCard('New Users', metrics?.newUsersCount ? formatNumber(metrics.newUsersCount) : '0', false, 'Last 30 days')}
              {renderStatCard('Paying Users', metrics?.payingUserRatio ? formatPercent(metrics.payingUserRatio) : '0%', true, 'Of total users')}
              {renderStatCard('7-Day Retention', metrics?.retention7DayPercent ? formatPercent(metrics.retention7DayPercent) : '0%', true, 'Users returning after 7 days')}
              {renderStatCard('30-Day Retention', metrics?.retention30DayPercent ? formatPercent(metrics.retention30DayPercent) : '0%', true, 'Users returning after 30 days')}
              {renderStatCard('Avg. Sessions/User', metrics?.averageSessionsPerUser ? metrics.averageSessionsPerUser.toFixed(1) : '0', false, 'Monthly average')}
            </div>
          </div>

          {/* Engagement Metrics Section */}
          <div className="w-full space-y-4 pt-6">
            <h2 className="text-2xl font-semibold">Engagement Metrics</h2>
            <div className="w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {renderStatCard('Total Schedules', metrics?.totalSchedules ? formatNumber(metrics.totalSchedules) : '0')}
              {renderStatCard('Avg. Schedules/User', metrics?.averageSchedulesPerUser ? metrics.averageSchedulesPerUser.toFixed(1) : '0')}
              {renderStatCard('Total Streaks', metrics?.totalStreaks ? formatNumber(metrics.totalStreaks) : '0')}
              {renderStatCard('Active Streaks', metrics?.activeStreaks ? formatNumber(metrics.activeStreaks) : '0')}
              {renderStatCard('Avg. Streak Length', metrics?.averageStreakLength ? metrics.averageStreakLength.toFixed(1) + ' days' : '0 days')}
              {renderStatCard('Achievements Unlocked', metrics?.totalAchievementsUnlocked ? formatNumber(metrics.totalAchievementsUnlocked) : '0')}
            </div>
          </div>

          {/* Growth & Trends Section */}
          {metrics?.trend && (
            <div className="w-full space-y-4 pt-6">
              <h2 className="text-2xl font-semibold">Growth & Trends</h2>
              <div className="w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {renderTrendCard(
                  'Current Period Users',
                  metrics.trend.currentNewUsers,
                  metrics.trend.prevNewUsers
                )}
                {renderStatCard(
                  'Growth Rate',
                  metrics.trend.growthRatePercent ? formatPercent(metrics.trend.growthRatePercent) : '0%',
                  true
                )}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-sm font-medium text-muted-foreground">Reporting Period</h3>
                  <div className="mt-2">
                    <p className="text-sm">
                      {format(new Date(metrics.trend.currentStart), 'MMM d, yyyy')} - {format(new Date(metrics.trend.currentEnd), 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      vs {format(new Date(metrics.trend.prevStart), 'MMM d')} - {format(new Date(metrics.trend.prevEnd), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Monthly User Growth Chart */}
              {metrics.monthlyGrowth?.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Monthly User Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={prepareMonthlyData(metrics.monthlyGrowth)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="formattedDate" 
                            angle={-45} 
                            textAnchor="end"
                            height={60}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value) => [value, 'Users']}
                            labelFormatter={(label) => `Period: ${label}`}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="count" 
                            name="New Users" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* User Distribution */}
              <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>User Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'Active', value: metrics.activeUsers },
                            { name: 'Inactive', value: metrics.inactiveUsers }
                          ]}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip formatter={(value) => [value, 'Users']} />
                          <Bar dataKey="value" fill="#8884d8" name="Users" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Average Sessions per User</h4>
                      <p className="text-2xl font-bold">{metrics.averageSessionsPerUser?.toFixed(1) || '0'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Average Schedules per User</h4>
                      <p className="text-2xl font-bold">{metrics.averageSchedulesPerUser?.toFixed(1) || '0'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Average Streak Length</h4>
                      <p className="text-2xl font-bold">{metrics.averageStreakLength?.toFixed(1) || '0'} days</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Top Achievements Section */}
          {metrics?.topAchievements && Object.keys(metrics.topAchievements).length > 0 && (
            <div className="w-full space-y-4 pt-6">
              <h2 className="text-2xl font-semibold">Top Achievements</h2>
              <div className="w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(metrics.topAchievements).slice(0, 6).map(([achievement, count]) => (
                  <div key={achievement} className="bg-card border border-border rounded-lg p-6">
                    <h3 className="font-medium">{achievement}</h3>
                    <p className="text-muted-foreground text-sm">{count} users</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subscription Breakdown */}
          {metrics?.usersBySubscription && Object.keys(metrics.usersBySubscription).length > 0 && (
            <div className="w-full space-y-4 pt-6">
              <h2 className="text-2xl font-semibold">Subscription Overview</h2>
              <div className="w-full grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {Object.entries(metrics.usersBySubscription).map(([plan, count]) => (
                  <div key={plan} className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {plan || 'No Subscription'}
                    </h3>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metrics.totalUsers ? ((count / metrics.totalUsers) * 100).toFixed(1) + '% of users' : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarInset>
  );
}
