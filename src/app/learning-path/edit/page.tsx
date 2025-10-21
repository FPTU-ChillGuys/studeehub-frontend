"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

interface SessionItem {
  day: DayKey;
  subject: string;
  time: string;
  durationHours: number;
}

export default function EditSchedulePage() {
  const [dailyGoal, setDailyGoal] = React.useState<number>(2);
  const [weeklyGoal, setWeeklyGoal] = React.useState<number>(10);
  const [preferredTime, setPreferredTime] = React.useState<string>("Evening (6-10 PM)");
  const [sessionMinutes, setSessionMinutes] = React.useState<number>(45);
  const [breakMinutes, setBreakMinutes] = React.useState<number>(15);
  const [reminders, setReminders] = React.useState<boolean>(true);

  const [activeDays, setActiveDays] = React.useState<Record<DayKey, boolean>>({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: true,
    Sun: true,
  });

  const [sessions, setSessions] = React.useState<SessionItem[]>([
    { day: "Mon", subject: "Mathematics", time: "7:00 PM - 9:00 PM", durationHours: 2 },
    { day: "Tue", subject: "Physics", time: "7:00 PM - 8:30 PM", durationHours: 1.5 },
    { day: "Wed", subject: "Mathematics", time: "7:00 PM - 9:00 PM", durationHours: 2 },
    { day: "Thu", subject: "Chemistry", time: "7:00 PM - 8:00 PM", durationHours: 1 },
    { day: "Fri", subject: "Physics", time: "7:00 PM - 8:30 PM", durationHours: 1.5 },
    { day: "Sat", subject: "Review", time: "2:00 PM - 4:00 PM", durationHours: 2 },
    { day: "Sun", subject: "Rest Day - Free", time: "", durationHours: 0 },
  ]);

  const totalCompleted = 3; // temporary mock like screenshot (3/7)
  const weeklyProgress = Math.round((totalCompleted / sessions.length) * 100);

  const toggleDay = (k: DayKey) => setActiveDays((d) => ({ ...d, [k]: !d[k] }));

  const addSession = () => {
    setSessions((prev) => [
      ...prev,
      { day: "Mon", subject: "New Session", time: "6:00 PM - 7:00 PM", durationHours: 1 },
    ]);
  };

  const removeSession = (idx: number) => setSessions((prev) => prev.filter((_, i) => i !== idx));

  const dayLabel: Record<DayKey, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  } as const;

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between mb-4">
          <Link href="/learning-path" className="text-sm text-blue-600 hover:underline">← Back to Learning Path</Link>
          <Button className="bg-green-600 hover:bg-green-700">Save Schedule</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Study Settings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-violet-100 text-violet-700">⚙️</span>
                <h2 className="font-semibold">Study Settings</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Daily Study Goal (hours)</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2" type="number" min={0} value={dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Weekly Study Goal (hours)</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2" type="number" min={0} value={weeklyGoal} onChange={(e) => setWeeklyGoal(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Preferred Study Time</label>
                  <select className="mt-1 w-full rounded-md border px-3 py-2" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}>
                    <option>Morning (6-10 AM)</option>
                    <option>Afternoon (12-4 PM)</option>
                    <option>Evening (6-10 PM)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Session Duration (minutes)</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2" type="number" min={15} step={5} value={sessionMinutes} onChange={(e) => setSessionMinutes(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Break Duration (minutes)</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2" type="number" min={5} step={5} value={breakMinutes} onChange={(e) => setBreakMinutes(Number(e.target.value))} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-md border px-3 py-2">
                <input id="remind" type="checkbox" checked={reminders} onChange={(e) => setReminders(e.target.checked)} />
                <label htmlFor="remind" className="text-sm">Enable study reminders</label>
              </div>
            </div>

            {/* Weekly Schedule list */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-pink-100 text-pink-700">📊</span>
                  <h2 className="font-semibold">Weekly Schedule</h2>
                </div>
                <Button variant="secondary" onClick={addSession}>+ Add Session</Button>
              </div>

              <div className="space-y-3">
                {sessions.map((s, idx) => (
                  <div key={idx} className={`rounded-lg border px-4 py-3 ${idx % 2 === 0 ? "bg-emerald-50/40" : "bg-indigo-50/40"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{dayLabel[s.day]}</div>
                        <div className="text-sm text-muted-foreground">{s.subject} · {s.time}</div>
                        <div className="text-xs text-muted-foreground">{s.durationHours} hours</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">✓</Button>
                        <Button variant="ghost" size="sm">✏️</Button>
                        <Button variant="ghost" size="sm" onClick={() => removeSession(idx)}>✕</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress summary */}
            <div className="rounded-xl p-5" style={{ background: "linear-gradient(90deg,#8b5cf6,#f97316)" }}>
              <div className="flex items-center gap-2 text-white">
                <span>📈</span>
                <div className="font-semibold">This Week's Progress</div>
                <div className="ml-auto text-right">
                  <div className="text-2xl font-bold">{weeklyProgress}%</div>
                  <div className="text-xs opacity-90">Weekly Goal</div>
                </div>
              </div>
              <div className="mt-1 text-white/90 text-sm">{totalCompleted} of {sessions.length} sessions completed</div>
            </div>
          </div>

          {/* Right: Study Days */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-emerald-100 text-emerald-700">📅</span>
                <h2 className="font-semibold">Study Days</h2>
              </div>
              <div className="space-y-2">
                {(["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] as DayKey[]).map((d) => (
                  <label key={d} className="flex items-center gap-2 rounded-md border px-3 py-2">
                    <input type="checkbox" checked={activeDays[d]} onChange={() => toggleDay(d)} />
                    <span>{dayLabel[d]}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


