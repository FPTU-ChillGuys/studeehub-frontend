"use client"

import { 
  Star,
  Zap,
  Target,
  Award,
  Trophy,
  CheckCircle,
  XCircle 
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Achievement } from "@/hooks/useProfile"

interface AchievementsProps {
  achievements: Achievement[];
  loading: boolean;
}

const getIcon = (id: string) => {
  switch (id) {
    case 'first_lesson':
      return Star;
    case 'week_streak':
      return Zap;
    case 'hundred_questions':
      return Target;
    case 'month_champion':
      return Award;
    case 'perfect_week':
      return Trophy;
    default:
      return Star;
  }
};

export function Achievements({ achievements, loading }: AchievementsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="shadow-lg">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-full"></div>
                      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
        <div className="text-sm text-gray-600">
          {achievements.filter(a => a.completed).length} of {achievements.length} earned
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const Icon = getIcon(achievement.id);
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
                        {achievement.progress !== undefined && (
                          <>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${achievement.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{achievement.progress}%</span>
                          </>
                        )}
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
  );
}
