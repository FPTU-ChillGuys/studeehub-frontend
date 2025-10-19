"use client";

import React, { useEffect, useState } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { getUserMetrics } from "@/features/admin";
import { Skeleton } from "@/components/ui/skeleton";

interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersCount: number;
  growthRatePercent: number;
  payingUserRatio: number;
  usersBySubscription: Record<string, number>;
  averageSessionsPerUser: number;
}

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

  const renderStatCard = (title: string, value: number | string, isPercentage = false) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {loading ? (
        <Skeleton className="h-8 w-20 mt-2" />
      ) : (
        <p className="text-2xl font-bold">
          {typeof value === 'number' && isPercentage ? `${value.toFixed(1)}%` : value}
        </p>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="p-6 text-destructive">
        <p>{error}</p>
      </div>
    );
  }
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage users, content, and system settings
          </p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {renderStatCard('Total Users', metrics?.totalUsers || 0)}
          {renderStatCard('Active Users', metrics?.activeUsers || 0)}
          {renderStatCard('New Users (24h)', metrics?.newUsersCount || 0)}
          {renderStatCard('Growth Rate', metrics?.growthRatePercent || 0, true)}
        </div>

        {/* Second Row of Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {renderStatCard('Inactive Users', metrics?.inactiveUsers || 0)}
          {renderStatCard('Paying Users', metrics?.payingUserRatio ? `${(metrics.payingUserRatio * 100).toFixed(1)}%` : '0%')}
          {renderStatCard('Avg. Sessions/User', metrics?.averageSessionsPerUser?.toFixed(1) || '0')}
        </div>

        {/* Subscription Breakdown */}
        {metrics?.usersBySubscription && Object.keys(metrics.usersBySubscription).length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Users by Subscription</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(metrics.usersBySubscription).map(([plan, count]) => (
                <div key={plan} className="bg-card border border-border rounded-lg p-4">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    {plan || 'No Subscription'}
                  </h4>
                  <p className="text-xl font-bold">{count}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">User Management</h3>
            <p className="text-muted-foreground mb-4">
              Manage user accounts, permissions, and access levels
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
              Manage Users
            </button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Content Moderation</h3>
            <p className="text-muted-foreground mb-4">
              Review and moderate user-generated content
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
              Review Content
            </button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">System Settings</h3>
            <p className="text-muted-foreground mb-4">
              Configure system-wide settings and preferences
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
              Settings
            </button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Analytics</h3>
            <p className="text-muted-foreground mb-4">
              View detailed analytics and reports
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
