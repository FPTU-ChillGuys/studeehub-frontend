"use client";

import React from "react";
import { AuthGuard } from "@/components/AuthGuard";

export default function AdminPage() {
  return (
    <AuthGuard requireAdmin={true}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
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
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Users
              </h3>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Active Sessions
              </h3>
              <p className="text-2xl font-bold">89</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Notebooks
              </h3>
              <p className="text-2xl font-bold">5,678</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                System Health
              </h3>
              <p className="text-2xl font-bold text-green-600">98%</p>
            </div>
          </div>

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
      </div>
    </AuthGuard>
  );
}
