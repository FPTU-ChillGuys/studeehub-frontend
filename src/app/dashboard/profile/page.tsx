"use client"

import { useState } from "react"
import { 
  Mail, 
  MapPin, 
  Calendar, 
  Edit3, 
  Clock, 
  BookOpen, 
  MessageSquare, 
  Sun,
  BarChart3,
  Trophy,
  Activity,
  Settings,
  TrendingUp,
  Star,
  Target,
  Zap,
  Award,
  CheckCircle,
  XCircle,
  ChevronRight,
  Bell,
  User,
  Shield,
  Palette,
  Globe
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "questions", label: "Questions", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const stats = [
    {
      title: "Total Study Hours",
      value: "247",
      icon: Clock,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Lessons Completed",
      value: "342",
      icon: BookOpen,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Questions Answered",
      value: "1,567",
      icon: MessageSquare,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Current Streak",
      value: "23",
      icon: Sun,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ]

  const learningProgress = [
    { subject: "Mathematics", progress: 85, color: "bg-blue-500" },
    { subject: "Physics", progress: 72, color: "bg-green-500" },
    { subject: "Chemistry", progress: 68, color: "bg-orange-500" },
    { subject: "Biology", progress: 45, color: "bg-purple-500" }
  ]

  const recentActivity = [
    {
      subject: "Mathematics",
      duration: "3.5 hours",
      date: "2024-01-30",
      lessons: "5 lessons completed",
      color: "bg-blue-500"
    },
    {
      subject: "Physics",
      duration: "2.5 hours",
      date: "2024-01-29",
      lessons: "3 lessons completed",
      color: "bg-green-500"
    },
    {
      subject: "Chemistry",
      duration: "4 hours",
      date: "2024-01-28",
      lessons: "6 lessons completed",
      color: "bg-orange-500"
    },
    {
      subject: "Biology",
      duration: "1.5 hours",
      date: "2024-01-27",
      lessons: "2 lessons completed",
      color: "bg-purple-500"
    }
  ]

  // Achievements data
  const achievements = [
    {
      id: "first_lesson",
      title: "First Steps",
      description: "Complete your first lesson",
      icon: Star,
      completed: true,
      earnedDate: "2024-01-15",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      id: "week_streak",
      title: "Week Warrior",
      description: "Study for 7 consecutive days",
      icon: Zap,
      completed: true,
      earnedDate: "2024-01-25",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      id: "hundred_questions",
      title: "Question Master",
      description: "Answer 100 questions correctly",
      icon: Target,
      completed: true,
      earnedDate: "2024-01-28",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      id: "month_champion",
      title: "Monthly Champion",
      description: "Study 30 hours in one month",
      icon: Award,
      completed: false,
      progress: 85,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      id: "perfect_week",
      title: "Perfect Week",
      description: "Get 100% on all quizzes for a week",
      icon: Trophy,
      completed: false,
      progress: 60,
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ]

  // Detailed activity log
  const detailedActivity = [
    {
      id: 1,
      type: "lesson_completed",
      title: "Completed Advanced Calculus Lesson",
      description: "Finished lesson 5.2: Derivatives and Applications",
      timestamp: "2024-01-30 14:30",
      subject: "Mathematics",
      icon: BookOpen,
      color: "text-blue-600"
    },
    {
      id: 2,
      type: "quiz_taken",
      title: "Physics Quiz Completed",
      description: "Scored 95% on Thermodynamics Quiz",
      timestamp: "2024-01-30 12:15",
      subject: "Physics",
      icon: Target,
      color: "text-green-600"
    },
    {
      id: 3,
      type: "question_answered",
      title: "Answered Chemistry Question",
      description: "Helped solve organic chemistry problem",
      timestamp: "2024-01-30 10:45",
      subject: "Chemistry",
      icon: MessageSquare,
      color: "text-orange-600"
    },
    {
      id: 4,
      type: "achievement_earned",
      title: "Earned Achievement: Question Master",
      description: "Reached 100 correct answers milestone",
      timestamp: "2024-01-29 16:20",
      subject: "General",
      icon: Award,
      color: "text-purple-600"
    },
    {
      id: 5,
      type: "study_session",
      title: "Study Session Completed",
      description: "Studied Biology for 2.5 hours",
      timestamp: "2024-01-29 09:30",
      subject: "Biology",
      icon: Clock,
      color: "text-indigo-600"
    }
  ]

  // Questions data
  const questions = [
    {
      id: 1,
      question: "How do I solve quadratic equations using the quadratic formula?",
      answer: "The quadratic formula is x = (-b ± √(b²-4ac)) / 2a. First identify a, b, and c from ax²+bx+c=0, then substitute into the formula...",
      subject: "Mathematics",
      date: "2024-01-28",
      status: "answered",
      rating: 5
    },
    {
      id: 2,
      question: "What is the difference between kinetic and potential energy?",
      answer: "Kinetic energy is the energy of motion, while potential energy is stored energy due to position or configuration...",
      subject: "Physics",
      date: "2024-01-27",
      status: "answered",
      rating: 4
    },
    {
      id: 3,
      question: "How do I balance chemical equations?",
      answer: "To balance chemical equations, ensure the same number of each type of atom on both sides...",
      subject: "Chemistry",
      date: "2024-01-26",
      status: "answered",
      rating: 5
    },
    {
      id: 4,
      question: "What are the stages of mitosis?",
      answer: "",
      subject: "Biology",
      date: "2024-01-25",
      status: "pending",
      rating: null
    }
  ]

  // Settings options
  const settings = [
    {
      category: "Account",
      icon: User,
      options: [
        { id: "profile", label: "Profile Information", description: "Update your personal details" },
        { id: "password", label: "Password & Security", description: "Change your password and security settings" },
        { id: "privacy", label: "Privacy Settings", description: "Control who can see your profile" }
      ]
    },
    {
      category: "Notifications",
      icon: Bell,
      options: [
        { id: "email", label: "Email Notifications", description: "Manage email notification preferences" },
        { id: "push", label: "Push Notifications", description: "Control mobile push notifications" },
        { id: "study", label: "Study Reminders", description: "Set up study reminders and alerts" }
      ]
    },
    {
      category: "Preferences",
      icon: Palette,
      options: [
        { id: "theme", label: "Theme & Appearance", description: "Choose your preferred theme" },
        { id: "language", label: "Language", description: "Select your preferred language" },
        { id: "timezone", label: "Timezone", description: "Set your local timezone" }
      ]
    },
    {
      category: "Privacy & Security",
      icon: Shield,
      options: [
        { id: "data", label: "Data & Privacy", description: "Manage your data and privacy settings" },
        { id: "security", label: "Security", description: "Two-factor authentication and security" },
        { id: "export", label: "Export Data", description: "Download your data" }
      ]
    }
  ]

  return (
    <main className="flex-1 p-6 md:p-10 w-full space-y-6">
      {/* Profile Header */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
        <div className="relative p-8 text-white">
          <div className="flex items-center justify-between">
            {/* Left side - Avatar and Info */}
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-white rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/60 rounded-lg"></div>
                  </div>
                </div>
              </div>
              
              {/* User Info */}
              <div className="space-y-3">
                <div>
                  <h1 className="text-3xl font-bold">Nguyen Van A</h1>
                  <p className="text-lg opacity-90">Advanced Mathematics Student</p>
                </div>
                
                {/* Info Pills */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">nguyenvana@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Ho Chi Minh, VN</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Joined Jan 2024</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Edit Button */}
            <Button className="bg-white/25 hover:bg-white/35 text-white border-0 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ring-1 ring-black/5 bg-gradient-to-br ${
              index === 0
                ? 'from-blue-100 via-blue-50 to-white'
                : index === 1
                ? 'from-green-100 via-green-50 to-white'
                : index === 2
                ? 'from-purple-100 via-purple-50 to-white'
                : 'from-orange-100 via-orange-50 to-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-3">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 drop-shadow-sm">{stat.value}</p>
              </div>
              <div
                className={`w-10 h-10 bg-white rounded-xl border flex items-center justify-center shadow-sm ${
                  index === 0
                    ? 'border-blue-300 text-blue-600'
                    : index === 1
                    ? 'border-green-300 text-green-600'
                    : index === 2
                    ? 'border-purple-300 text-purple-600'
                    : 'border-orange-300 text-orange-600'
                }`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
            </div>

            {/* glossy highlight */}
            <div className="pointer-events-none absolute inset-x-2 -top-2 h-6 rounded-full bg-white/50 blur-lg opacity-40" />
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
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
            )
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Learning Progress */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Learning Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {learningProgress.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{item.subject}</span>
                    <span className="text-sm font-semibold text-gray-600">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${item.color} transition-all duration-500 ease-out`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
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
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
            <div className="text-sm text-gray-600">
              {achievements.filter(a => a.completed).length} of {achievements.length} earned
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <Card key={achievement.id} className={`shadow-lg hover:shadow-xl transition-all duration-300 ${
                  achievement.completed ? 'ring-2 ring-green-200' : 'opacity-75'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${achievement.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${achievement.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                        
                        {achievement.completed ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">Earned {achievement.earnedDate}</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-gray-500">
                              <XCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">In Progress</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${achievement.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{achievement.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
          
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                {detailedActivity.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center ${activity.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{activity.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{activity.subject}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === "questions" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Questions & Answers</h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Ask New Question
            </Button>
          </div>
          
          <div className="space-y-4">
            {questions.map((q) => (
              <Card key={q.id} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">{q.question}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{q.subject}</span>
                          <span>•</span>
                          <span>{q.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {q.status === "answered" ? (
                          <div className="flex items-center space-x-1">
                            {[...Array(q.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">{q.rating}/5</span>
                          </div>
                        ) : (
                          <span className="text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Pending</span>
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
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          
          <div className="space-y-6">
            {settings.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.category} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <span>{category.category}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {category.options.map((option) => (
                      <div key={option.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{option.label}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Streak Banner */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>
        <div className="relative p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">23 Day Streak!</h2>
                <p className="text-lg opacity-90">Keep up the amazing work!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Personal best: 31 days</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
