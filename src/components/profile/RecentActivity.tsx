"use client"

import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentActivity as RecentActivityType } from "@/hooks/useProfile"

interface RecentActivityProps {
  recentActivity: RecentActivityType[];
  loading: boolean;
}

export function RecentActivity({ recentActivity, loading }: RecentActivityProps) {
  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-green-600" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivity.map((activity, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start space-x-3">
              <div className={`w-3 h-3 ${activity.color} rounded-full mt-2 flex-shrink-0`}></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Studied {activity.subject} for {activity.duration}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.date} • {activity.lessons}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
