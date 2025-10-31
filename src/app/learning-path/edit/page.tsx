"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import scheduleService, { ScheduleItem, CreateScheduleRequest, UpdateScheduleRequest } from "@/service/scheduleService";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface SessionItem {
  id?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  subject: string;
  startTime: string; // e.g., "19:00" (24-hour format)
  endTime: string; // e.g., "21:00" (24-hour format)
  description?: string;
  reminderMinutesBefore?: number;
  isCheckin?: boolean; // Check-in status
}

export default function EditSchedulePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<'all' | 'saved' | 'unsaved'>('all');
  const [filterCheckin, setFilterCheckin] = useState<'all' | 'checked' | 'unchecked' | 'overdue'>('all');

  // Load existing schedules on component mount
  useEffect(() => {
    if (userId) {
      loadSchedules();
    }
  }, [userId]);

  // Helper function to determine session status
  const getSessionStatus = (session: SessionItem) => {
    const now = new Date();
    const sessionDate = new Date(session.date);
    const sessionEndTime = new Date(`${session.date}T${session.endTime}`);
    
    // Check if session is overdue (end time has passed AND isCheckin is false)
    if (sessionEndTime < now && session.isCheckin === false) {
      return 'overdue';
    }
    
    // Check if session has been checked in
    if (session.isCheckin === true) {
      return 'checked';
    }
    
    return 'unchecked';
  };

  const loadSchedules = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await scheduleService.getUserSchedules(userId);
      
      if (response.success && Array.isArray(response.data)) {
        // Convert API data to SessionItem format
        const sessionItems: SessionItem[] = response.data.map((schedule: ScheduleItem) => ({
          id: schedule.id,
          date: new Date(schedule.startTime).toISOString().split('T')[0],
          subject: schedule.title,
          startTime: new Date(schedule.startTime).toTimeString().slice(0, 5),
          endTime: new Date(schedule.endTime).toTimeString().slice(0, 5),
          description: schedule.description,
          reminderMinutesBefore: schedule.reminderMinutesBefore,
          isCheckin: schedule.isCheckin || false, // Get check-in status from API
        }));
        setSessions(sessionItems);
      } else {
        setSessions([]);
      }
    } catch (err: any) {
      console.error("Failed to load schedules:", err);
      // Continue with empty sessions if API fails
    } finally {
      setLoading(false);
    }
  };

  const addSession = () => {
    const newSession: SessionItem = {
      date: selectedDate,
      subject: "",
      startTime: "19:00",
      endTime: "21:00",
      description: "",
      reminderMinutesBefore: 15,
    };
    setSessions((prev) => [...prev, newSession]);
  };

  const removeSession = (idx: number) => {
    const session = sessions[idx];
    if (session.id) {
      // Delete from API
      deleteSchedule(session.id);
    }
    setSessions((prev) => prev.filter((_, i) => i !== idx));
  };

  const deleteSchedule = async (scheduleId: string) => {
    try {
      await scheduleService.deleteSchedule(scheduleId);
    } catch (err) {
      console.error("Failed to delete schedule:", err);
    }
  };

  const updateSession = (idx: number, updates: Partial<SessionItem>) => {
    setSessions((prev) => prev.map((s, i) => (i === idx ? { ...s, ...updates } : s)));
  };

  const saveSchedule = async (session: SessionItem, idx: number) => {
    if (!userId) return;
    
    // Validation
    if (!session.subject.trim()) {
      setError("Please enter a subject for the session");
      return;
    }
    
    if (!session.date) {
      setError("Please select a date for the session");
      return;
    }
    
    if (!session.startTime || !session.endTime) {
      setError("Please enter start and end times for the session");
      return;
    }
    
    // Validate that end time is after start time
    const startDateTime = new Date(`${session.date}T${session.startTime}`);
    const endDateTime = new Date(`${session.date}T${session.endTime}`);
    
    if (endDateTime <= startDateTime) {
      setError("End time must be after start time");
      return;
    }
    
    // Check for overlaps with existing sessions on the same date
    const hasOverlap = sessions.some((existingSession, existingIdx) => {
      if (existingIdx === idx || !existingSession.id || existingSession.date !== session.date) return false;
      
      const existingStart = new Date(`${existingSession.date}T${existingSession.startTime}`);
      const existingEnd = new Date(`${existingSession.date}T${existingSession.endTime}`);
      
      // Check for time overlap
      return (startDateTime < existingEnd && endDateTime > existingStart);
    });
    
    if (hasOverlap) {
      setError("This schedule overlaps with an existing schedule on the same date");
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const startTimeISO = startDateTime.toISOString();
      const endTimeISO = endDateTime.toISOString();
      
      if (session.id) {
        // Update existing schedule
        const updateData: UpdateScheduleRequest = {
          title: session.subject,
          startTime: startTimeISO,
          endTime: endTimeISO,
          description: session.description,
          reminderMinutesBefore: session.reminderMinutesBefore,
        };
        
        await scheduleService.updateSchedule(session.id, updateData);
        setSuccess("Schedule updated successfully!");
        // Reload schedules to get the latest data
        await loadSchedules();
      } else {
        // Create new schedule
        const createData: CreateScheduleRequest = {
          userId: userId,
          title: session.subject,
          startTime: startTimeISO,
          endTime: endTimeISO,
          description: session.description,
          reminderMinutesBefore: session.reminderMinutesBefore,
        };
        
        const response = await scheduleService.createSchedule(createData);
        
        if (response.success) {
          // Update the session with the actual ID from response
          const newScheduleId = response.data && typeof response.data === 'object' && 'id' in response.data 
            ? (response.data as any).id 
            : `schedule-${Date.now()}`; // fallback ID
          updateSession(idx, { id: newScheduleId });
          setSuccess("Schedule created successfully!");
          // Reload schedules to get the latest data
          await loadSchedules();
        } else {
          setError(response.message || "Failed to create schedule");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  // Get current week dates for calendar view
  const currentDay = currentDate.getDay();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDay + 1); // Start from Monday

  const weekDays: Array<{
    date: Date;
    dateString: string;
    dayName: string;
    dayNumber: number;
    month: string;
  }> = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDays.push({
      date,
      dateString: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' })
    });
  }

  // Group sessions by date
  const sessionsByDate = new Map();
  sessions.forEach(session => {
    if (!sessionsByDate.has(session.date)) {
      sessionsByDate.set(session.date, []);
    }
    sessionsByDate.get(session.date).push(session);
  });

  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/learning-path" className="text-sm text-muted-foreground hover:text-foreground">Learning Path</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Schedule</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <Button asChild variant="outline">
            <Link href="/learning-path">📅 Back to Schedule</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 w-full">
        <section className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">Edit Schedule ⚙️</h1>
            <p className="text-sm text-gray-600">Create and manage your study schedule</p>
          </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {/* Calendar View */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                📅 Weekly Calendar View
              </CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="date-select">Add to date:</Label>
                <Input
                  id="date-select"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
                <Button onClick={addSession} size="sm">
                  ➕ Add Session
                </Button>
              </div>
            </div>
            
            {/* Month Navigation */}
            <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(currentDate.getMonth() - 1);
                    setCurrentDate(newDate);
                  }}
                >
                  ← Previous Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  This Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(currentDate.getMonth() + 1);
                    setCurrentDate(newDate);
                  }}
                >
                  Next Month →
                </Button>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filter Section */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="filter-status">Save Status:</Label>
                    <select
                      id="filter-status"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as 'all' | 'saved' | 'unsaved')}
                      className="px-3 py-1 border rounded-md text-sm"
                    >
                      <option value="all">All Sessions</option>
                      <option value="saved">Saved Sessions</option>
                      <option value="unsaved">Unsaved Sessions</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor="filter-checkin">Check-in Status:</Label>
                    <select
                      id="filter-checkin"
                      value={filterCheckin}
                      onChange={(e) => setFilterCheckin(e.target.value as 'all' | 'checked' | 'unchecked' | 'overdue')}
                      className="px-3 py-1 border rounded-md text-sm"
                    >
                      <option value="all">All Sessions</option>
                      <option value="checked">Checked In</option>
                      <option value="unchecked">Not Checked In</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  Total: {sessions.length} | Saved: {sessions.filter(s => s.id).length} | Unsaved: {sessions.filter(s => !s.id).length} | 
                  Overdue: {sessions.filter(s => getSessionStatus(s) === 'overdue').length}
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white border rounded-lg overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-3 bg-gray-50 border-r last:border-r-0 text-center font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar weeks */}
              {(() => {
                // Get current month dates
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                
                // Get first day of month and last day of month
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const firstDayOfWeek = firstDay.getDay();
                
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

                // Group sessions by date
                const scheduleMap = new Map();
                sessions.forEach(session => {
                  const sessionDate = new Date(session.date);
                  const dateKey = sessionDate.toDateString();
                  
                  if (!scheduleMap.has(dateKey)) {
                    scheduleMap.set(dateKey, []);
                  }
                  scheduleMap.get(dateKey).push(session);
                });

                return weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
                    {week.map((day, dayIndex) => {
                      const dateKey = day.date.toDateString();
                      const daySessions = scheduleMap.get(dateKey) || [];
                      
                      // Filter sessions based on both filters
                      const filteredSessions = daySessions.filter((session: SessionItem) => {
                        // Apply save status filter
                        let passesSaveFilter = true;
                        if (filterStatus === 'saved') passesSaveFilter = Boolean(session.id);
                        if (filterStatus === 'unsaved') passesSaveFilter = !session.id;
                        
                        // Apply check-in status filter
                        let passesCheckinFilter = true;
                        const sessionStatus = getSessionStatus(session);
                        if (filterCheckin === 'checked') passesCheckinFilter = sessionStatus === 'checked';
                        if (filterCheckin === 'unchecked') passesCheckinFilter = sessionStatus === 'unchecked';
                        if (filterCheckin === 'overdue') passesCheckinFilter = sessionStatus === 'overdue';
                        
                        return passesSaveFilter && passesCheckinFilter;
                      });
                      
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
                          
                          {/* Sessions for this day */}
                          <div className="space-y-1">
                            {filteredSessions.map((session: SessionItem) => {
                              const isSaved = Boolean(session.id);
                              const sessionStatus = getSessionStatus(session);
                              const isOverdue = sessionStatus === 'overdue';
                              const isChecked = sessionStatus === 'checked';
                              const isCheckin = session.isCheckin === true;
                              
                              return (
                                <div 
                                  key={session.id || `temp-${session.date}-${session.startTime}`}
                          className={`rounded p-1 text-xs border bg-gray-50 border-gray-200`}
                                >
                          <div className={`font-medium truncate ${
                                    isOverdue 
                                      ? 'text-red-700' 
                                      : isChecked 
                                        ? 'text-green-700' 
                                        : 'text-gray-800'
                                  }`}>
                                    {session.subject}
                                    {isOverdue && ' ⏰'}
                                  </div>
                          <div className={`text-xs ${
                                    isOverdue 
                                      ? 'text-red-600' 
                                      : isChecked 
                                        ? 'text-green-600' 
                                        : 'text-gray-600'
                                  }`}>
                                    {session.startTime} - {session.endTime}
                                  </div>
                                  <div className="flex items-center justify-between mt-1">
                                    <div className={`w-2 h-2 rounded-full ${
                                      isOverdue 
                                        ? 'bg-red-500' 
                                        : isChecked 
                                          ? 'bg-green-500' 
                                          : 'bg-gray-300'
                                    }`}></div>
                                    <button
                                      onClick={() => saveSchedule(session, sessions.indexOf(session))}
                                      className={`text-xs px-1 py-0.5 rounded ${
                                        isOverdue 
                                          ? 'bg-red-500 text-white hover:bg-red-600' 
                                          : isChecked 
                                            ? 'bg-green-600 text-white hover:bg-green-700' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                      }`}
                                    >
                                      {isOverdue ? "Overdue" : isCheckin ? "Checked In" : isSaved ? "Update" : "Save"}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ));
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Session Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Manage Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.map((session, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={session.date}
                        onChange={(e) => updateSession(idx, { date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input
                        value={session.subject}
                        onChange={(e) => updateSession(idx, { subject: e.target.value })}
                        placeholder="Enter subject"
                      />
                    </div>
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={session.startTime}
                        onChange={(e) => updateSession(idx, { startTime: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={session.endTime}
                        onChange={(e) => updateSession(idx, { endTime: e.target.value })}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button
                        onClick={() => saveSchedule(session, idx)}
                        disabled={saving || !session.subject}
                        size="sm"
                        className="flex-1"
                      >
                        💾 {session.id ? "Update" : "Save"}
                      </Button>
                      <Button
                        onClick={() => removeSession(idx)}
                        variant="outline"
                        size="sm"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label>Description (optional)</Label>
                    <Input
                      value={session.description || ""}
                      onChange={(e) => updateSession(idx, { description: e.target.value })}
                      placeholder="Add a description..."
                    />
                  </div>
                </div>
              ))}
              
              {sessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-3">📅</div>
                  <p>No sessions scheduled yet.</p>
                  <p className="text-sm">Click "Add Session" to create your first study session.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </section>
      </main>
    </>
  );
}