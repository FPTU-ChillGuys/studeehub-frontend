"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, CheckCircle, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import scheduleService, { ScheduleItem } from "@/service/scheduleService";

// Mock data for development when backend is not available
const mockSchedules: ScheduleItem[] = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    title: "Mathematics Study Session",
    startTime: "2024-01-30T19:00:00.000Z",
    endTime: "2024-01-30T21:00:00.000Z",
    description: "Advanced calculus and algebra review",
    isCheckin: true,
    checkInTime: "2024-01-30T19:05:00.000Z",
    reminderMinutesBefore: 15,
  },
  {
    id: "4fa85f64-5717-4562-b3fc-2c963f66afa7", 
    title: "Physics Problem Solving",
    startTime: "2024-01-31T19:00:00.000Z",
    endTime: "2024-01-31T20:30:00.000Z",
    description: "Thermodynamics and mechanics",
    isCheckin: false,
    reminderMinutesBefore: 30,
  },
  {
    id: "5fa85f64-5717-4562-b3fc-2c963f66afa8",
    title: "Chemistry Lab Review",
    startTime: "2024-02-01T19:00:00.000Z", 
    endTime: "2024-02-01T21:00:00.000Z",
    description: "Organic chemistry reactions",
    isCheckin: false,
    reminderMinutesBefore: 20,
  },
];

export default function LearningPathPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    if (!userId) {
      setSchedules([]);
      setLoading(false);
      return;
    }
    
    async function fetchSchedules() {
      setLoading(true);
      setError(null);
      setIsUsingMockData(false);
      
      try {
        const response = await scheduleService.getUserSchedules(userId!);
        if (response.success && response.data) {
          setSchedules(response.data);
        } else {
          setSchedules([]);
        }
      } catch (err: any) {
        // Check if it's a network error or JSON parsing error
        if (err.message && (
          err.message.includes("Failed to fetch") || 
          err.message.includes("Unexpected end of JSON input") ||
          err.message.includes("HTTP 404") ||
          err.message.includes("HTTP 500")
        )) {
          console.log("[DEV] Backend not available, using mock data");
          setSchedules(mockSchedules);
          setIsUsingMockData(true);
          setError(null);
        } else {
          setError(err.message || "Failed to load schedules");
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchSchedules();
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#f7f8fa] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#4f46e5] flex items-center gap-2">
              Learning Path <span className="inline-block w-4 h-4 bg-indigo-200 rounded-full" />
            </h1>
            <p className="text-sm text-gray-500">Personalized learning journey tailored to your goals</p>
            {isUsingMockData && (
              <p className="text-xs text-amber-600 mt-1">
                📡 Using demo data - backend not available
              </p>
            )}
          </div>
          <Button asChild className="bg-gradient-to-r from-indigo-400 to-pink-400 text-white flex items-center gap-2 shadow-md">
            <Link href="/learning-path/edit">
              <Calendar className="w-4 h-4" /> Edit Schedule
            </Link>
          </Button>
        </div>

        <Card className="mb-6 shadow-lg border-0">
          <CardContent className="p-6 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <span className="font-semibold text-lg">Your Study Schedule</span>
            </div>
            
            {loading && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                Loading schedules...
              </div>
            )}
            
            {error && !isUsingMockData && (
              <div className="text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            {!loading && (
              <div className="space-y-4">
                {schedules.length === 0 && !isUsingMockData && (
                  <div className="text-gray-400 text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No schedules found.</p>
                    <p className="text-sm">Create your first study schedule to get started!</p>
                  </div>
                )}
                
                {schedules.map((item) => (
                  <div key={item.id} className="rounded-lg p-4 border bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        item.isCheckin ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {item.isCheckin ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-base">{item.title}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500">{item.description}</div>
                        )}
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.startTime).toLocaleString()} - {new Date(item.endTime).toLocaleString()}
                        </div>
                        {item.isCheckin && item.checkInTime && (
                          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <CheckCircle className="w-3 h-3" />
                            Checked in at {new Date(item.checkInTime).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!item.isCheckin && (
                      <Button size="sm" variant="outline" className="text-xs">
                        Check In
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
