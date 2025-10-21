"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LearningPathPage() {
  const [selectedSubject, setSelectedSubject] = React.useState<string>("math");

  const subjects = {
    math: {
      title: "Advanced Mathematics",
      subtitle: "Master calculus, algebra, and advanced mathematical concepts",
      progress: 65,
      lessons: "29/45 lessons",
      levelBadge: { text: "Advanced", className: "bg-rose-100 text-rose-700" },
      bar: "from-blue-500 via-purple-500 to-pink-500",
      modules: [
        {
          name: "Linear Algebra Fundamentals",
          meta: "8/8 lessons · 100% complete · 12h estimated",
          tone: "bg-emerald-50",
          action: "Review",
          progress: 100,
          bar: "from-emerald-500 to-emerald-500",
        },
        {
          name: "Calculus I - Derivatives",
          meta: "12/12 lessons · 100% complete · 18h estimated",
          tone: "bg-white border",
          action: "Review",
          progress: 100,
          bar: "from-green-500 to-green-500",
        },
        {
          name: "Calculus II - Integrals",
          meta: "7/10 lessons · 70% complete · 15h estimated",
          tone: "bg-white border",
          action: "Continue",
          progress: 70,
          bar: "from-indigo-500 to-blue-500",
        },
        {
          name: "Differential Equations",
          meta: "2/15 lessons · 13% complete · 25h estimated",
          tone: "bg-white border",
          action: "Start",
          progress: 13,
          bar: "from-sky-500 to-indigo-500",
        },
      ],
    },
    physics: {
      title: "Physics Mastery",
      subtitle: "Comprehensive physics from mechanics to quantum",
      progress: 40,
      lessons: "24/60 lessons",
      levelBadge: { text: "Intermediate", className: "bg-amber-100 text-amber-700" },
      bar: "from-blue-500 via-purple-500 to-pink-500",
      modules: [
        {
          name: "Classical Mechanics",
          meta: "15/15 lessons · 100% complete · 20h estimated",
          tone: "bg-emerald-50",
          action: "Review",
          progress: 100,
          bar: "from-emerald-500 to-emerald-500",
        },
        {
          name: "Thermodynamics",
          meta: "9/12 lessons · 75% complete · 16h estimated",
          tone: "bg-indigo-50",
          action: "Continue",
          progress: 75,
          bar: "from-indigo-500 to-blue-500",
        },
        {
          name: "Electromagnetism",
          meta: "0/18 lessons · 0% complete · 24h estimated",
          tone: "bg-white border",
          action: "Start",
          progress: 0,
          bar: "from-slate-300 to-slate-300",
        },
        {
          name: "Modern Physics",
          meta: "0/15 lessons · 0% complete · 22h estimated",
          tone: "bg-white border",
          action: "Start",
          progress: 0,
          bar: "from-slate-300 to-slate-300",
        },
      ],
    },
    chemistry: {
      title: "Chemistry Essentials",
      subtitle: "Organic, inorganic, and physical chemistry",
      progress: 20,
      lessons: "8/40 lessons",
      levelBadge: { text: "Beginner", className: "bg-blue-100 text-blue-700" },
      bar: "from-cyan-500 to-sky-500",
      modules: [
        {
          name: "Atomic Structure",
          meta: "4/10 lessons · 40% complete · 8h estimated",
          tone: "bg-white border",
          action: "Continue",
          progress: 40,
          bar: "from-sky-500 to-indigo-500",
        },
      ],
    },
  } as const;

  const current = subjects[selectedSubject as keyof typeof subjects];

  function ProgressBar({ value, gradient }: { value: number; gradient: string }) {
    return (
      <div className="h-3 bg-gray-200/70 rounded-full overflow-hidden">
        <div className={`h-3 rounded-full bg-gradient-to-r ${gradient}`} style={{ width: `${value}%` }} />
      </div>
    );
  }

  const schedule = [
    { day: "Monday", subject: "math", title: "Mathematics", time: "7:00 PM - 9:00 PM" },
    { day: "Tuesday", subject: "physics", title: "Physics", time: "7:00 PM - 8:30 PM" },
    { day: "Wednesday", subject: "math", title: "Mathematics", time: "7:00 PM - 9:00 PM" },
    { day: "Thursday", subject: "chemistry", title: "Chemistry", time: "7:00 PM - 8:00 PM" },
  ];

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Learning Path <span className="text-primary">●</span></h1>
            <p className="text-sm text-muted-foreground">Personalized learning journey tailored to your goals</p>
          </div>
          <div>
            <Button asChild>
              <Link href="/learning-path/edit">Edit Schedule</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold">This Week's Schedule</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-3">
              {schedule.map((slot) => (
                <button
                  key={`${slot.day}-${slot.subject}`}
                  onClick={() => setSelectedSubject(slot.subject)}
                  className={`text-left p-3 rounded-md border transition-colors ${
                    selectedSubject === slot.subject ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50" : "bg-white"
                  }`}
                >
                  <div className="font-medium">{slot.day}</div>
                  <div className="text-sm text-muted-foreground">{slot.title}<br/>{slot.time}</div>
                </button>
              ))}
            </div>

            <h3 className="font-semibold mt-6">This Week's Subjects</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(subjects).map(([key, s]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSubject(key)}
                  className={`text-left p-4 rounded-xl border bg-gradient-to-br from-white to-slate-50 transition shadow-sm ${
                    selectedSubject === key ? "ring-2 ring-blue-200 border-blue-400" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{s.title}</div>
                      <p className="text-sm text-muted-foreground">{s.subtitle}</p>
                      <div className="mt-2 text-xs text-muted-foreground">{s.lessons}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.levelBadge.className}`}>{s.levelBadge.text}</span>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={s.progress} gradient={s.bar} />
                  </div>
                  <div className="mt-1 text-xs font-semibold text-blue-600">{s.progress}% complete</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{current.title}</h2>
                  <p className="text-sm text-muted-foreground">{current.subtitle}</p>
                </div>
                <div className="text-sm text-muted-foreground">{current.progress}% Complete</div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {current.modules.map((m) => (
                  <div key={m.name} className={`${m.tone} rounded-lg p-4`}> 
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{m.name}</h3>
                        <p className="text-sm text-muted-foreground">{m.meta}</p>
                      </div>
                      <Button variant="ghost" size="sm">{m.action}</Button>
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={m.progress} gradient={m.bar} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg p-6" style={{ background: "linear-gradient(90deg,#8b5cf6,#f97316)" }}>
                <h3 className="text-white font-semibold mb-2">AI Study Recommendations</h3>
                <ul className="list-disc pl-5 text-white">
                  <li>Focus on integration by parts - you've struggled with this in previous exercises</li>
                  <li>Review derivatives before moving to advanced integrals</li>
                  <li>Practice more word problems to strengthen application skills</li>
                  <li>Consider reviewing Linear Algebra concepts as they'll be useful for Differential Equations</li>
                  <li>Your optimal study time is evening - stick to your schedule!</li>
                </ul>
                <div className="mt-4">
                  <Button>Get Detailed Study Plan</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
