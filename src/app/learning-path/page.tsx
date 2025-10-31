"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import scheduleService, { ScheduleItem } from "@/service/scheduleService";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// Mock data for development when backend is not available
const mockSchedules: ScheduleItem[] = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    title: "Mathematics Study Session",
    startTime: "2024-10-26T05:00:00.000Z",
    endTime: "2024-10-26T07:00:00.000Z",
    description: "Advanced calculus and algebra review",
    isCheckin: true,
    checkInTime: "2024-10-26T05:05:00.000Z",
    reminderMinutesBefore: 15,
  },
  {
    id: "4fa85f64-5717-4562-b3fc-2c963f66afa7", 
    title: "Physics Problem Solving",
    startTime: "2024-10-27T12:00:00.000Z",
    endTime: "2024-10-27T14:00:00.000Z",
    description: "Thermodynamics and mechanics",
    isCheckin: false,
    reminderMinutesBefore: 30,
  },
  {
    id: "5fa85f64-5717-4562-b3fc-2c963f66afa8",
    title: "Chemistry Lab Review",
    startTime: "2024-10-28T12:00:00.000Z", 
    endTime: "2024-10-28T14:00:00.000Z",
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
  const [checkInError, setCheckInError] = useState<string | null>(null);

  const handleCheckIn = async (scheduleId: string) => {
    try {
      setCheckInError(null); // Clear previous errors
      console.log(`[CheckIn] Attempting to check in schedule: ${scheduleId}`);
      const response = await scheduleService.checkInSchedule(scheduleId);
      console.log(`[CheckIn] API Response:`, response);
      
      if (response.success) {
        console.log(`[CheckIn] Success! Reloading schedules...`);
        // Reload schedules to update check-in status
        if (userId) {
          const updatedResponse = await scheduleService.getUserSchedules(userId);
          if (updatedResponse.success && Array.isArray(updatedResponse.data)) {
            setSchedules(updatedResponse.data);
            console.log(`[CheckIn] Schedules updated successfully`);
          }
        }
      } else {
        console.error(`[CheckIn] API returned success: false`, response);
        setCheckInError(response.message || "Failed to check in");
      }
    } catch (err: any) {
      console.error("[CheckIn] Failed to check in:", err);
      // Extract error message from ApiError
      const errorMessage = err.message || "Failed to check in. Please try again.";
      setCheckInError(errorMessage);
    }
  };

  const forceReloadSchedules = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    setIsUsingMockData(false);
    
    try {
      const response = await scheduleService.getUserSchedules(userId);
      if (response.success && Array.isArray(response.data)) {
        setSchedules(response.data);
      } else {
        setSchedules([]);
      }
    } catch (err: any) {
      console.error("[FORCE RELOAD] Error:", err);
      setError(err.message || "Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

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
        if (response.success) {
          // API returns data as array directly
          if (Array.isArray(response.data)) {
            setSchedules(response.data);
          } else {
            setSchedules([]);
          }
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
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Learning Path</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <Button asChild className="bg-gradient-to-r from-indigo-400 to-pink-400 text-white flex items-center gap-2 shadow-md">
            <Link href="/learning-path/edit">📅 Edit Schedule</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6 md:p-10 w-full">
        <section className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#4f46e5] flex items-center gap-2">
              Learning Path <span className="inline-block w-4 h-4 bg-indigo-200 rounded-full" />
            </h1>
            <p className="text-sm text-gray-500">Personalized learning journey tailored to your goals</p>
            {isUsingMockData && (
              <p className="text-xs text-amber-600 mt-1">📡 Using demo data - backend not available</p>
            )}
          </div>

        {/* Study Progress - Moved to top */}
        <div className="mb-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Study Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {schedules.length}
                  </div>
                  <div className="text-sm text-blue-500">Total Sessions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {schedules.filter(s => s.isCheckin).length}
                  </div>
                  <div className="text-sm text-green-500">Completed</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {schedules.length > 0 ? Math.round((schedules.filter(s => s.isCheckin).length / schedules.length) * 100) : 0}%
                  </div>
                  <div className="text-sm text-purple-500">Completion Rate</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {schedules.filter(s => !s.isCheckin).length}
                  </div>
                  <div className="text-sm text-orange-500">Pending</div>
                </div>
              </div>
              
              {schedules.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Upcoming Sessions</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {schedules
                      .filter(s => !s.isCheckin)
                      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                      .slice(0, 3)
                      .map((item) => (
                        <div key={item.id} className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                          <div className="font-medium">{item.title}</div>
                          <div>{new Date(item.startTime).toLocaleDateString()} at {new Date(item.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Full Calendar View */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📅 Study Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            )}
            
            {error && !isUsingMockData && (
              <div className="text-red-500 bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            {!loading && (
              <div className="overflow-x-auto">
                {schedules.length === 0 && !isUsingMockData ? (
                  <div className="text-gray-400 text-center py-8">
                    <div className="text-4xl mb-3">📅</div>
                    <p>No schedules found.</p>
                    <p className="text-sm">Create your first study schedule to get started!</p>
                  </div>
                ) : (
                  <CalendarGrid schedules={schedules} onCheckIn={handleCheckIn} />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Popup - Transparent overlay */}
        {checkInError && (
          <div className="fixed top-4 right-4 z-50 max-w-sm">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-red-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-lg">⚠️</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Check-in Failed</h4>
                  <p className="text-red-700 text-xs mb-3">{checkInError}</p>
                  <Button 
                    onClick={() => setCheckInError(null)}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white text-xs"
                  >
                    Close
                  </Button>
                </div>
                <button 
                  onClick={() => setCheckInError(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
        </section>
      </main>
    </div>
  );
}

// Calendar Grid Component
function CalendarGrid({ schedules, onCheckIn }: { schedules: ScheduleItem[], onCheckIn: (id: string) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Generate time slots from 6 AM to 11 PM to cover more hours
  const timeSlots = [];
  for (let hour = 6; hour <= 23; hour++) {
    timeSlots.push({
      hour,
      label: hour <= 12 ? `${hour === 12 ? 12 : hour}:00 ${hour < 12 ? 'AM' : 'PM'}` : `${hour === 12 ? 12 : hour - 12}:00 PM`
    });
  }

  // Get current month dates - show full month calendar
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month and last day of month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Create calendar grid (6 weeks x 7 days = 42 days)
  const calendarDays: Array<{
    date: Date;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
  }> = [];
  
  // Add previous month's trailing days
  const prevMonth = new Date(year, month - 1, 0);
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonth.getDate() - i);
    calendarDays.push({
      date,
      dayNumber: date.getDate(),
      isCurrentMonth: false,
      isToday: false
    });
  }
  
  // Add current month's days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const today = new Date();
    calendarDays.push({
      date,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString()
    });
  }
  
  // Add next month's leading days to fill the grid
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    calendarDays.push({
      date,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: false
    });
  }
  
  // Group calendar days into weeks
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  // Group schedules by date
  const scheduleMap = new Map();
  schedules.forEach(schedule => {
    const scheduleDate = new Date(schedule.startTime);
    const dateKey = scheduleDate.toDateString();
    
    if (!scheduleMap.has(dateKey)) {
      scheduleMap.set(dateKey, []);
    }
    scheduleMap.get(dateKey).push(schedule);
  });

  // Debug logging
  console.log('Schedules to display:', schedules);
  console.log('Schedule map:', scheduleMap);

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Month Navigation Header */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            >
              ← Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            >
              Next →
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-3 bg-gray-50 border-r last:border-r-0 text-center font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar weeks */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
              {week.map((day, dayIndex) => {
                const dateKey = day.date.toDateString();
                const daySchedules = scheduleMap.get(dateKey) || [];
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`min-h-[120px] border-r last:border-r-0 p-2 ${
                      day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${day.isToday ? 'bg-blue-50 border-blue-200' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${day.isToday ? 'text-blue-600' : ''}`}>
                      {day.dayNumber}
                    </div>
                    
                    {/* Schedules for this day */}
                    <div className="space-y-1">
                      {daySchedules.map((schedule: ScheduleItem) => {
                        const startTime = new Date(schedule.startTime);
                        const endTime = new Date(schedule.endTime);
                        const isCheckedIn = Boolean(schedule.isCheckin);
                        
                        // Debug logging for check-in status
                        console.log(`[Schedule] ${schedule.title} - isCheckin: ${schedule.isCheckin} -> ${isCheckedIn}`);
                        
                        return (
                            <div 
                            key={schedule.id}
                            className={`rounded p-1 text-xs border ${
                              isCheckedIn 
                                ? 'bg-green-100 border-green-300 shadow-sm' 
                                : 'bg-blue-100 border-blue-300'
                            }`}
                          >
                            <div className={`font-medium truncate ${
                              isCheckedIn ? 'text-green-800' : 'text-blue-800'
                            }`}>
                              {schedule.title}
                            </div>
                            <div className={`text-xs ${
                              isCheckedIn ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {startTime.toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit', 
                                hour12: true 
                              })} - {endTime.toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit', 
                                hour12: true 
                              })}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                isCheckedIn ? 'bg-green-500' : 'bg-gray-300'
                              }`}></div>
                              {!isCheckedIn && (
                                <button
                                  onClick={() => onCheckIn(schedule.id)}
                                  className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded hover:bg-blue-600"
                                >
                                  Check In
                                </button>
                              )}
                              {isCheckedIn && (
                                <span className="text-xs text-green-600 font-medium">
                                  ✓ Checked In
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
