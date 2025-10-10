"use client"

import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LearningProgress as LearningProgressType } from "@/hooks/useProfile"

interface LearningProgressProps {
  learningProgress: LearningProgressType[];
  loading: boolean;
}

export function LearningProgress({ learningProgress, loading }: LearningProgressProps) {
  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Learning Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-8 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="h-3 bg-gray-300 rounded-full animate-pulse" style={{ width: '60%' }}></div>
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
  );
}
