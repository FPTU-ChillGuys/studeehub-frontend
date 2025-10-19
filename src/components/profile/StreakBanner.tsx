"use client";

import { Sun } from "lucide-react";
import { ProfileStats } from "@/hooks/useProfile";

interface StreakBannerProps {
  stats: ProfileStats;
  userName?: string;
  loading: boolean;
}

export function StreakBanner({ stats, userName, loading }: StreakBannerProps) {
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/30 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-8 w-48 bg-white/30 rounded"></div>
              <div className="h-4 w-64 bg-white/30 rounded"></div>
            </div>
          </div>
          <div className="h-6 w-48 bg-white/30 rounded"></div>
        </div>
      </div>
    );
  }

  const currentStreak = stats.currentCount || 0;
  const longestStreak = stats.longestCount || 0;

  // Messages based on streak count
  const getStreakMessage = (count: number) => {
    if (count === 0) return "Start your learning streak today!";
    if (count === 1) return "Great start! Keep going!";
    if (count < 7) return "You're building momentum!";
    if (count < 30) return "Keep up the amazing work!";
    if (count < 100) return "You're on fire! Keep pushing!";
    return "Legendary streak! You're unstoppable!";
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>

      {/* Content */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Sun icon with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Sun className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          {/* Text content */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">
              {currentStreak === 1
                ? "Day Streak!"
                : `${currentStreak} Day Streak!`}
            </h2>
            <p className="text-white/90 text-lg">
              {getStreakMessage(currentStreak)}
              {userName ? `, ${userName}!` : ""}
            </p>
          </div>
        </div>

        {/* Personal best */}
        {longestStreak > 0 && (
          <div className="text-right">
            <p className="text-white/80 text-sm font-medium mb-1">
              Personal best
            </p>
            <p className="text-white text-2xl font-bold">
              {longestStreak} days
            </p>
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
    </div>
  );
}
