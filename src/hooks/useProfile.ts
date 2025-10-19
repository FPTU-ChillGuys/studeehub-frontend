import { useState, useEffect } from "react";
import { User } from "@/Types";
import { getCurrentUser } from "@/features/auth/";
import streakService from "@/service/streakService";

export interface ProfileStats {
  totalStudyHours: number;
  lessonsCompleted: number;
  questionsAnswered: number;
  currentCount: number;
  longestCount: number;
}

export interface LearningProgress {
  subject: string;
  progress: number;
  color: string;
}

export interface RecentActivity {
  subject: string;
  duration: string;
  date: string;
  lessons: string;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  earnedDate?: string;
  progress?: number;
  color: string;
  bgColor: string;
}

export interface DetailedActivity {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  subject: string;
  color: string;
}

export interface Question {
  id: number;
  question: string;
  answer: string;
  subject: string;
  date: string;
  status: "answered" | "pending";
  rating?: number;
}

export interface ProfileData {
  user: User | null;
  stats: ProfileStats;
  learningProgress: LearningProgress[];
  recentActivity: RecentActivity[];
  achievements: Achievement[];
  detailedActivity: DetailedActivity[];
  questions: Question[];
  loading: boolean;
  error: string | null;
}

export function useProfile() {
  const [profileData, setProfileData] = useState<ProfileData>({
    user: null,
    stats: {
      totalStudyHours: 0,
      lessonsCompleted: 0,
      questionsAnswered: 0,
      currentCount: 0,
      longestCount: 0,
    },
    learningProgress: [],
    recentActivity: [],
    achievements: [],
    detailedActivity: [],
    questions: [],
    loading: true,
    error: null,
  });

  const fetchProfileData = async () => {
    try {
      setProfileData((prev) => ({ ...prev, loading: true, error: null }));

      // Get user data
      const user = await getCurrentUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Fetch real streak data
      let currentCount = 0;
      let longestCount = 0;

      try {
        const streakResponse = await streakService.getStreaks(user.id);

        // Check if response is an array directly (backend returns array in data field)
        if (Array.isArray(streakResponse) && streakResponse.length > 0) {
          const loginStreak = streakResponse[0]; // Get the first streak (type 1)
          currentCount = loginStreak.currentCount;
          longestCount = loginStreak.longestCount;
        } 
        // Check if response has data property with array
        else if (streakResponse.data && Array.isArray(streakResponse.data) && streakResponse.data.length > 0) {
          const loginStreak = streakResponse.data[0];
          currentCount = loginStreak.currentCount;
          longestCount = loginStreak.longestCount;
        }
      } catch {
        // Continue with default values if streak fetch fails
        // This is not critical for profile display
      }

      // TODO: Replace with actual API calls when backend is ready
      // For now, using mock data with user info
      const mockStats: ProfileStats = {
        totalStudyHours: 247,
        lessonsCompleted: 342,
        questionsAnswered: 1567,
        currentCount,
        longestCount,
      };

      const mockLearningProgress: LearningProgress[] = [
        { subject: "Mathematics", progress: 85, color: "bg-blue-500" },
        { subject: "Physics", progress: 72, color: "bg-green-500" },
        { subject: "Chemistry", progress: 68, color: "bg-orange-500" },
        { subject: "Biology", progress: 45, color: "bg-purple-500" },
      ];

      const mockRecentActivity: RecentActivity[] = [
        {
          subject: "Mathematics",
          duration: "3.5 hours",
          date: "2024-01-30",
          lessons: "5 lessons completed",
          color: "bg-blue-500",
        },
        {
          subject: "Physics",
          duration: "2.5 hours",
          date: "2024-01-29",
          lessons: "3 lessons completed",
          color: "bg-green-500",
        },
        {
          subject: "Chemistry",
          duration: "4 hours",
          date: "2024-01-28",
          lessons: "6 lessons completed",
          color: "bg-orange-500",
        },
        {
          subject: "Biology",
          duration: "1.5 hours",
          date: "2024-01-27",
          lessons: "2 lessons completed",
          color: "bg-purple-500",
        },
      ];

      const mockAchievements: Achievement[] = [
        {
          id: "first_lesson",
          title: "First Steps",
          description: "Complete your first lesson",
          completed: true,
          earnedDate: "2024-01-15",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        },
        {
          id: "week_streak",
          title: "Week Warrior",
          description: "Study for 7 consecutive days",
          completed: true,
          earnedDate: "2024-01-25",
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        },
        {
          id: "hundred_questions",
          title: "Question Master",
          description: "Answer 100 questions correctly",
          completed: true,
          earnedDate: "2024-01-28",
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          id: "month_champion",
          title: "Monthly Champion",
          description: "Study 30 hours in one month",
          completed: false,
          progress: 85,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          id: "perfect_week",
          title: "Perfect Week",
          description: "Get 100% on all quizzes for a week",
          completed: false,
          progress: 60,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
      ];

      const mockDetailedActivity: DetailedActivity[] = [
        {
          id: 1,
          type: "lesson_completed",
          title: "Completed Advanced Calculus Lesson",
          description: "Finished lesson 5.2: Derivatives and Applications",
          timestamp: "2024-01-30 14:30",
          subject: "Mathematics",
          color: "text-blue-600",
        },
        {
          id: 2,
          type: "quiz_taken",
          title: "Physics Quiz Completed",
          description: "Scored 95% on Thermodynamics Quiz",
          timestamp: "2024-01-30 12:15",
          subject: "Physics",
          color: "text-green-600",
        },
        {
          id: 3,
          type: "question_answered",
          title: "Answered Chemistry Question",
          description: "Helped solve organic chemistry problem",
          timestamp: "2024-01-30 10:45",
          subject: "Chemistry",
          color: "text-orange-600",
        },
        {
          id: 4,
          type: "achievement_earned",
          title: "Earned Achievement: Question Master",
          description: "Reached 100 correct answers milestone",
          timestamp: "2024-01-29 16:20",
          subject: "General",
          color: "text-purple-600",
        },
        {
          id: 5,
          type: "study_session",
          title: "Study Session Completed",
          description: "Studied Biology for 2.5 hours",
          timestamp: "2024-01-29 09:30",
          subject: "Biology",
          color: "text-indigo-600",
        },
      ];

      const mockQuestions: Question[] = [
        {
          id: 1,
          question:
            "How do I solve quadratic equations using the quadratic formula?",
          answer:
            "The quadratic formula is x = (-b ± √(b²-4ac)) / 2a. First identify a, b, and c from ax²+bx+c=0, then substitute into the formula...",
          subject: "Mathematics",
          date: "2024-01-28",
          status: "answered",
          rating: 5,
        },
        {
          id: 2,
          question:
            "What is the difference between kinetic and potential energy?",
          answer:
            "Kinetic energy is the energy of motion, while potential energy is stored energy due to position or configuration...",
          subject: "Physics",
          date: "2024-01-27",
          status: "answered",
          rating: 4,
        },
        {
          id: 3,
          question: "How do I balance chemical equations?",
          answer:
            "To balance chemical equations, ensure the same number of each type of atom on both sides...",
          subject: "Chemistry",
          date: "2024-01-26",
          status: "answered",
          rating: 5,
        },
        {
          id: 4,
          question: "What are the stages of mitosis?",
          answer: "",
          subject: "Biology",
          date: "2024-01-25",
          status: "pending",
          rating: undefined,
        },
      ];

      setProfileData({
        user,
        stats: mockStats,
        learningProgress: mockLearningProgress,
        recentActivity: mockRecentActivity,
        achievements: mockAchievements,
        detailedActivity: mockDetailedActivity,
        questions: mockQuestions,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setProfileData((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load profile data",
      }));
    }
  };

  const refreshProfile = () => {
    fetchProfileData();
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return {
    ...profileData,
    refreshProfile,
  };
}
