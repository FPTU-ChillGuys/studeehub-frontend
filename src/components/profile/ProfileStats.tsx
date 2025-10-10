"use client"

import { 
  Clock, 
  BookOpen, 
  MessageSquare, 
  Sun 
} from "lucide-react"
import { ProfileStats as ProfileStatsType } from "@/hooks/useProfile"

interface ProfileStatsProps {
  stats: ProfileStatsType;
  loading: boolean;
}

export function ProfileStats({ stats, loading }: ProfileStatsProps) {
  const statsConfig = [
    {
      title: "Total Study Hours",
      value: stats.totalStudyHours.toString(),
      icon: Clock,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      gradient: "from-blue-100 via-blue-50 to-white"
    },
    {
      title: "Lessons Completed",
      value: stats.lessonsCompleted.toString(),
      icon: BookOpen,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      gradient: "from-green-100 via-green-50 to-white"
    },
    {
      title: "Questions Answered",
      value: stats.questionsAnswered.toLocaleString(),
      icon: MessageSquare,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      gradient: "from-purple-100 via-purple-50 to-white"
    },
    {
      title: "Current Streak",
      value: stats.currentStreak.toString(),
      icon: Sun,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      gradient: "from-orange-100 via-orange-50 to-white"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative rounded-2xl p-6 shadow-lg ring-1 ring-black/5 bg-gray-100"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-3"></div>
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="w-10 h-10 bg-gray-300 rounded-xl ml-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`relative rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ring-1 ring-black/5 bg-gradient-to-br ${stat.gradient}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-3">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 drop-shadow-sm">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 bg-white rounded-xl border flex items-center justify-center shadow-sm ${stat.bgColor.replace('100', '300')} ${stat.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* glossy highlight */}
            <div className="pointer-events-none absolute inset-x-2 -top-2 h-6 rounded-full bg-white/50 blur-lg opacity-40" />
          </div>
        );
      })}
    </div>
  );
}
