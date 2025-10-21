"use client";

import { useState } from "react";
import {
  Activity,
  Settings,
  TrendingUp,
  MessageSquare,
  Trophy,
  ChevronRight,
  Bell,
  User,
  Shield,
  Palette,
  BookOpen,
  Clock,
  Target,
  Award,
  CheckCircle,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { StreakBanner } from "@/components/profile/StreakBanner";
import { LearningProgress } from "@/components/profile/LearningProgress";
import { RecentActivity } from "@/components/profile/RecentActivity";
import { Achievements } from "@/components/profile/Achievements";
import { ProfileError } from "@/components/profile/ProfileError";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import dynamic from "next/dynamic";
const ProfileSettings = dynamic(() => import("./settings"), { ssr: false });
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const {
    user,
    stats,
    learningProgress,
    recentActivity,
    achievements,
    detailedActivity,
    questions,
    loading,
    error,
    refreshProfile,
  } = useProfile();

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "questions", label: "Questions", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    console.log("Edit profile clicked");
  };

  // Settings options
  const settings = [
    {
      category: "Account",
      icon: User,
      options: [
        {
          id: "profile",
          label: "Profile Information",
          description: "Update your personal details",
        },
        {
          id: "password",
          label: "Password & Security",
          description: "Change your password and security settings",
        },
        {
          id: "privacy",
          label: "Privacy Settings",
          description: "Control who can see your profile",
        },
      ],
    },
    {
      category: "Notifications",
      icon: Bell,
      options: [
        {
          id: "email",
          label: "Email Notifications",
          description: "Manage email notification preferences",
        },
        {
          id: "push",
          label: "Push Notifications",
          description: "Control mobile push notifications",
        },
        {
          id: "study",
          label: "Study Reminders",
          description: "Set up study reminders and alerts",
        },
      ],
    },
    {
      category: "Preferences",
      icon: Palette,
      options: [
        {
          id: "theme",
          label: "Theme & Appearance",
          description: "Choose your preferred theme",
        },
        {
          id: "language",
          label: "Language",
          description: "Select your preferred language",
        },
        {
          id: "timezone",
          label: "Timezone",
          description: "Set your local timezone",
        },
      ],
    },
    {
      category: "Privacy & Security",
      icon: Shield,
      options: [
        {
          id: "data",
          label: "Data & Privacy",
          description: "Manage your data and privacy settings",
        },
        {
          id: "security",
          label: "Security",
          description: "Two-factor authentication and security",
        },
        {
          id: "export",
          label: "Export Data",
          description: "Download your data",
        },
      ],
    },
  ];

  if (error) {
    return <ProfileError error={error} onRetry={refreshProfile} />;
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 md:p-10 w-full space-y-6">
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          loading={loading}
          onEditProfile={handleEditProfile}
        />

        {/* Summary Statistics */}
        <ProfileStats stats={stats} loading={loading} />

        {/* Streak Banner */}
        <StreakBanner stats={stats} userName={user?.name} loading={loading} />

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Learning Progress and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Learning Progress */}
              <LearningProgress
                learningProgress={learningProgress}
                loading={loading}
              />

              {/* Recent Activity */}
              <RecentActivity
                recentActivity={recentActivity}
                loading={loading}
              />
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <Achievements achievements={achievements} loading={loading} />
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>

            {loading ? (
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="w-10 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                          <div className="flex space-x-4">
                            <div className="h-3 bg-gray-300 rounded w-24 animate-pulse"></div>
                            <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {detailedActivity.map((activity) => {
                      const getIcon = (type: string) => {
                        switch (type) {
                          case "lesson_completed":
                            return BookOpen;
                          case "quiz_taken":
                            return Target;
                          case "question_answered":
                            return MessageSquare;
                          case "achievement_earned":
                            return Award;
                          case "study_session":
                            return Clock;
                          default:
                            return Activity;
                        }
                      };

                      const Icon = getIcon(activity.type);
                      return (
                        <div
                          key={activity.id}
                          className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div
                            className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center ${activity.color}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {activity.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-gray-500">
                                {activity.timestamp}
                              </span>
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                {activity.subject}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Questions & Answers
              </h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Ask New Question
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="shadow-lg">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                            <div className="flex space-x-4">
                              <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
                              <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
                            </div>
                          </div>
                          <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        <div className="h-16 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q) => (
                  <Card key={q.id} className="shadow-lg">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-2">
                              {q.question}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{q.subject}</span>
                              <span>•</span>
                              <span>{q.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {q.status === "answered" && q.rating ? (
                              <div className="flex items-center space-x-1">
                                {[...Array(q.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 text-yellow-400 fill-current"
                                  />
                                ))}
                                <span className="text-sm text-gray-600 ml-2">
                                  {q.rating}/5
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>

                        {q.answer && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700">{q.answer}</p>
                          </div>
                        )}

                        {q.status === "answered" && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Answered</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <ProfileSettings />
        )}
      </main>
    </SidebarInset>
  );
}
