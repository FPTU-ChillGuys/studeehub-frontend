"use client";

import { useEffect, useState } from "react";
import {
  X,
  Clock,
  Calendar,
  Flame,
  ChevronLeft,
  ChevronRight,
  ChartArea,
  List,
  Crown,
  Lock,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import pomodoroService, {
  SessionHistoryResponse,
  SessionHistoryItem,
} from "@/service/pomodoroService";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

type TabType = "summary" | "detail" | "ranking";
type TimeRangeType = "week" | "month" | "year";

export default function ReportModal({
  isOpen,
  onClose,
  userId,
}: ReportModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [timeRange, setTimeRange] = useState<TimeRangeType>("week");
  const [historyData, setHistoryData] = useState<SessionHistoryResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = this week, -1 = last week

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await pomodoroService.getSessionHistory(userId, 1, 100);
      setHistoryData(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const stats = historyData?.data?.[0];
  const sessions = stats?.sessions || [];

  // Calculate activity summary
  const totalHoursFocused = stats
    ? Math.round((stats.totalFocusMinutes / 60) * 10) / 10
    : 0;

  const daysAccessed = stats
    ? new Set(sessions.map((s) => new Date(s.start).toDateString())).size
    : 0;

  const dayStreak = calculateStreak(sessions);

  // Prepare chart data for week view
  const chartData = prepareChartData(sessions, timeRange);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">Pomodoro Report</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b flex-shrink-0">
          <button
            onClick={() => setActiveTab("summary")}
            className={`flex-1 py-4 px-6 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "summary"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ChartArea className="w-4 h-4" />
            Summary
          </button>
          <button
            onClick={() => setActiveTab("detail")}
            className={`flex-1 py-4 px-6 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "detail"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <List className="w-4 h-4" />
            Detail
          </button>
          <button
            onClick={() => setActiveTab("ranking")}
            className={`flex-1 py-4 px-6 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "ranking"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Crown className="w-4 h-4" />
            Ranking
          </button>
        </div>

        {/* Content - with fixed height and scroll */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-gray-500">Loading...</div>
            </div>
          ) : activeTab === "summary" ? (
            <div className="space-y-6">
              {/* Activity Summary */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Activity Summary
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {/* Hours Focused */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center">
                    <Clock className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      {totalHoursFocused}
                    </div>
                    <div className="text-sm text-red-500 font-medium">
                      hours focused
                    </div>
                  </div>

                  {/* Days Accessed */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center">
                    <Calendar className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      {daysAccessed}
                    </div>
                    <div className="text-sm text-red-500 font-medium">
                      days accessed
                    </div>
                  </div>

                  {/* Day Streak */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center">
                    <Flame className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      {dayStreak}
                    </div>
                    <div className="text-sm text-red-500 font-medium">
                      day streak
                    </div>
                  </div>
                </div>
              </div>

              {/* Focus Hours Chart */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Focus Hours
                  </h3>
                  <div className="group relative">
                    <Info className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-help" />
                    <div className="absolute right-0 top-6 w-64 bg-gray-800 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg">
                      <p className="font-semibold mb-1">Cách tính biểu đồ:</p>
                      <p className="mb-2">
                        <span className="text-red-400">Focus Time:</span> Tổng thời gian của các Work sessions đã hoàn thành
                      </p>
                      <p>
                        <span className="text-red-300">Break Time:</span> Tổng thời gian của Short Break và Long Break đã hoàn thành
                      </p>
                      <div className="mt-2 pt-2 border-t border-gray-600 text-gray-300">
                        Chỉ tính các session có status = &quot;Completed&quot;
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTimeRange("week")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        timeRange === "week"
                          ? "bg-red-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setTimeRange("month")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        timeRange === "month"
                          ? "bg-red-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Month
                    </button>
                    <button
                      disabled
                      className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-400 cursor-not-allowed flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Year
                    </button>
                  </div>

                  {/* Week Navigation */}
                  {timeRange === "week" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentWeek(currentWeek - 1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Previous week"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium min-w-[100px] text-center">
                        {currentWeek === 0
                          ? "This Week"
                          : currentWeek === -1
                          ? "Last Week"
                          : `${Math.abs(currentWeek)} weeks ago`}
                      </span>
                      <button
                        onClick={() => setCurrentWeek(currentWeek + 1)}
                        disabled={currentWeek >= 0}
                        className={`p-2 rounded-lg transition-colors ${
                          currentWeek >= 0
                            ? "text-gray-300 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                        aria-label="Next week"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Chart */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <YAxis
                        label={{
                          value: "Hours",
                          angle: -90,
                          position: "insideLeft",
                          style: { fill: "#6b7280", fontSize: 12 },
                        }}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          paddingTop: "20px",
                        }}
                      />
                      <Bar
                        dataKey="focus"
                        fill="#ef4444"
                        name="Focus Time"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="break"
                        fill="#fca5a5"
                        name="Break Time"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Session Statistics */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Session Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-medium">
                      Completion Rate
                    </div>
                    <div className="text-3xl font-bold text-gray-800">
                      {stats?.completionRate || 0}%
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-medium">
                      Total Sessions
                    </div>
                    <div className="text-3xl font-bold text-gray-800">
                      {stats?.totalCount || 0}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-medium">
                      Focus Sessions
                    </div>
                    <div className="text-3xl font-bold text-gray-800">
                      {sessions.filter((s) => s.type === "Work").length}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-medium">
                      Break Sessions
                    </div>
                    <div className="text-3xl font-bold text-gray-800">
                      {sessions.filter((s) => s.type !== "Work").length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "detail" ? (
            <div className="h-full flex flex-col">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex-shrink-0">
                Session Details
              </h3>
              <div className="space-y-2 overflow-y-auto flex-1">
                {sessions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No sessions found
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            session.type === "Work"
                              ? "bg-red-500"
                              : session.type === "ShortBreak"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium text-gray-800">
                            {session.type === "Work"
                              ? "🎯 Work Session"
                              : session.type === "ShortBreak"
                              ? "☕ Short Break"
                              : "🌟 Long Break"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(session.start).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            session.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : session.status === "Skipped"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {session.status}
                        </span>
                        <span className="text-sm text-gray-600 font-mono">
                          {session.duration}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Ranking Coming Soon
                </h3>
                <p className="text-gray-500">
                  Compare your progress with other users and climb the
                  leaderboard!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function calculateStreak(sessions: SessionHistoryItem[]): number {
  if (sessions.length === 0) return 0;

  const completedSessions = sessions.filter((s) => s.status === "Completed");
  const dates = completedSessions
    .map((s) => new Date(s.start).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;

  for (let i = 0; i < dates.length; i++) {
    const date = new Date(dates[i]);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);

    if (date.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function prepareChartData(
  sessions: SessionHistoryItem[],
  timeRange: TimeRangeType
) {
  if (timeRange === "week") {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = days.map((day, index) => {
      const date = new Date();
      date.setDate(date.getDate() - date.getDay() + index + 1);
      const dateStr = date.toDateString();

      const daySessions = sessions.filter(
        (s) => new Date(s.start).toDateString() === dateStr
      );

      const focusMinutes = daySessions
        .filter((s) => s.type === "Work" && s.status === "Completed")
        .reduce((acc, s) => {
          const duration = s.duration.split(":");
          return acc + parseInt(duration[0]) * 60 + parseInt(duration[1]);
        }, 0);

      const breakMinutes = daySessions
        .filter((s) => s.type !== "Work" && s.status === "Completed")
        .reduce((acc, s) => {
          const duration = s.duration.split(":");
          return acc + parseInt(duration[0]) * 60 + parseInt(duration[1]);
        }, 0);

      return {
        name: day,
        focus: Math.round((focusMinutes / 60) * 10) / 10,
        break: Math.round((breakMinutes / 60) * 10) / 10,
      };
    });

    return data;
  }

  // Month view - show by week
  if (timeRange === "month") {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    return weeks.map((week) => ({
      name: week,
      focus: Math.random() * 10,
      break: Math.random() * 3,
    }));
  }

  return [];
}
