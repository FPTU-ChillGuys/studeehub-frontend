"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Pause, RotateCcw, ChartArea, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsModal } from "@/components/pomodoro/SettingsModal";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { usePomodoroSettings } from "@/hooks/usePomodoroSettings";
import { useSession } from "next-auth/react";
import pomodoroService from "@/service/pomodoroService";
import { soundManager } from "@/lib/sounds";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

// Helper function to determine next mode in manual mode
// Logic: Work -> ShortBreak/LongBreak -> Work
// Long break occurs after completing longBreakInterval pomodoros
const getNextModeManual = (
  currentMode: TimerMode,
  completedPomodoros: number,
  longBreakInterval: number
): TimerMode => {
  if (currentMode === "pomodoro") {
    // After completing a pomodoro, check if it's time for long break
    if (completedPomodoros % longBreakInterval === 0) {
      return "longBreak";
    } else {
      return "shortBreak";
    }
  } else {
    // After any break, go back to work
    return "pomodoro";
  }
};

const PomodoroPage = () => {
  const { data: session } = useSession();
  const {
    settings: userSettings,
    updateSettings,
    isLoading: settingsLoading,
  } = usePomodoroSettings();
  const [currentMode, setCurrentMode] = useState<TimerMode>("pomodoro");
  const [isRunning, setIsRunning] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [shouldAutoContinue, setShouldAutoContinue] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0); // Track completed pomodoros in manual mode

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Map userSettings to local settings format with useMemo
  const settings = useMemo(() => {
    return userSettings
      ? {
          pomodoro: userSettings.workDuration,
          shortBreak: userSettings.shortBreakDuration,
          longBreak: userSettings.longBreakDuration,
          longBreakInterval: userSettings.longBreakInterval,
          autoStartNext: userSettings.autoStartNext,
        }
      : {
          pomodoro: 25,
          shortBreak: 5,
          longBreak: 15,
          longBreakInterval: 4,
          autoStartNext: false,
        };
  }, [userSettings]);

  // Initialize timeLeft based on settings and current mode
  const [timeLeft, setTimeLeft] = useState(() => settings.pomodoro * 60);

  // Handle settings change from modal
  const handleSettingsChange = async (newSettings: {
    pomodoro?: number;
    workDuration?: number;
    shortBreak?: number;
    shortBreakDuration?: number;
    longBreak?: number;
    longBreakDuration?: number;
    longBreakInterval?: number;
    autoStartNext?: boolean;
    autoStartBreaks?: boolean;
  }) => {
    try {
      // Ensure all values are valid numbers
      const workDuration = Number(
        newSettings.pomodoro ?? newSettings.workDuration ?? 25
      );
      const shortBreakDuration = Number(
        newSettings.shortBreak ?? newSettings.shortBreakDuration ?? 5
      );
      const longBreakDuration = Number(
        newSettings.longBreak ?? newSettings.longBreakDuration ?? 15
      );
      const longBreakInterval = Number(newSettings.longBreakInterval ?? 4);
      const autoStartNext = Boolean(
        newSettings.autoStartNext ?? newSettings.autoStartBreaks ?? false
      );

      // Validate ranges
      if (workDuration < 1 || workDuration > 60) {
        alert("Pomodoro duration must be between 1 and 60 minutes");
        return;
      }
      if (shortBreakDuration < 1 || shortBreakDuration > 30) {
        alert("Short break duration must be between 1 and 30 minutes");
        return;
      }
      if (longBreakDuration < 1 || longBreakDuration > 60) {
        alert("Long break duration must be between 1 and 60 minutes");
        return;
      }
      if (longBreakInterval < 1 || longBreakInterval > 10) {
        alert("Long break interval must be between 1 and 10");
        return;
      }

      const requestBody = {
        workDuration,
        shortBreakDuration,
        longBreakDuration,
        longBreakInterval,
        autoStartNext,
      };

      await updateSettings(requestBody);
      // Reset timer when settings change
      setIsRunning(false);
    } catch (error) {
      console.error("Failed to update settings:", error);
      // Show detailed error message
      if (error instanceof Error) {
        alert(`Failed to save settings: ${error.message}`);
      } else {
        alert("Failed to save settings. Please try again.");
      }
    }
  };

  // Initialize time based on current mode and settings
  useEffect(() => {
    switch (currentMode) {
      case "pomodoro":
        setTimeLeft(settings.pomodoro * 60);
        break;
      case "shortBreak":
        setTimeLeft(settings.shortBreak * 60);
        break;
      case "longBreak":
        setTimeLeft(settings.longBreak * 60);
        break;
    }
  }, [currentMode, settings]);

  // Handle auto-continue separately to avoid conflicts with settings changes
  useEffect(() => {
    if (shouldAutoContinue) {
      setIsRunning(true);
      setShouldAutoContinue(false);
    }
  }, [shouldAutoContinue]);

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Handle timer completion
  useEffect(() => {
    const handleTimerComplete = async () => {
      if (timeLeft === 0 && isRunning && session?.user?.id) {
        try {
          // Play completion sound
          soundManager.playBell();

          // Complete current session - backend auto-creates next session if autoStartNext is enabled
          const nextSession = await pomodoroService.completeSession(
            session.user.id
          );

          alert(
            `${currentMode === "pomodoro" ? "Pomodoro" : "Break"} completed!`
          );

          if (nextSession && settings.autoStartNext) {
            // Case 1: autoStartNext = true, backend created next session
            setCurrentSessionId(nextSession.id);

            // Map backend session type to our TimerMode
            const nextMode = mapSessionTypeToMode(nextSession.type);

            // Set flag to auto-continue
            setShouldAutoContinue(true);
            setCurrentMode(nextMode);
          } else {
            // Case 2: autoStartNext = false, manually switch to next mode

            // Increment pomodoro count if completing a pomodoro session
            let newPomodoroCount = pomodoroCount;
            if (currentMode === "pomodoro") {
              newPomodoroCount = pomodoroCount + 1;
              setPomodoroCount(newPomodoroCount);
            }

            const nextMode = getNextModeManual(
              currentMode,
              newPomodoroCount,
              settings.longBreakInterval
            );

            setCurrentMode(nextMode);
            // Timer stops, user must click START
            setIsRunning(false);
          }
        } catch (error) {
          console.error("Failed to complete session:", error);
          alert("Failed to complete session. Please try again.");
          setIsRunning(false);
        }
      }
    };

    handleTimerComplete();
  }, [
    timeLeft,
    isRunning,
    currentMode,
    session,
    settings.autoStartNext,
    settings.longBreakInterval,
    pomodoroCount,
  ]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Convert mode to session type (1: Work, 2: Short Break, 3: Long Break)
  const getSessionType = (mode: TimerMode): number => {
    switch (mode) {
      case "pomodoro":
        return 1;
      case "shortBreak":
        return 2;
      case "longBreak":
        return 3;
      default:
        return 1;
    }
  };

  // Map backend session type to our TimerMode
  const mapSessionTypeToMode = (type: string): TimerMode => {
    switch (type) {
      case "Work":
        return "pomodoro";
      case "ShortBreak":
        return "shortBreak";
      case "LongBreak":
        return "longBreak";
      default:
        return "pomodoro";
    }
  };

  const handleStart = async () => {
    soundManager.playClick();

    if (!session?.user?.id) {
      alert("Please login to use Pomodoro timer");
      return;
    }

    try {
      // Call API to start session
      const sessionResponse = await pomodoroService.startSession(
        session.user.id,
        getSessionType(currentMode)
      );
      setCurrentSessionId(sessionResponse.id);
      setIsRunning(true);
    } catch (error) {
      console.error("Failed to start session:", error);
      alert("Failed to start timer session. Please try again.");
    }
  };

  const handlePause = () => {
    soundManager.playClick();
    setIsRunning(false);
  };

  const handleReset = () => {
    soundManager.playClick();
    setIsRunning(false);
    switch (currentMode) {
      case "pomodoro":
        setTimeLeft(settings.pomodoro * 60);
        break;
      case "shortBreak":
        setTimeLeft(settings.shortBreak * 60);
        break;
      case "longBreak":
        setTimeLeft(settings.longBreak * 60);
        break;
    }
  };

  const handleModeChange = (mode: TimerMode) => {
    soundManager.playSwitch();
    setCurrentMode(mode);
    setIsRunning(false);
  };

  const handleSkip = async () => {
    soundManager.playClick();

    if (!session?.user?.id) {
      alert("Please login to use Pomodoro timer");
      return;
    }

    try {
      // Skip current session - backend auto-creates next session if autoStartNext is enabled
      const nextSession = await pomodoroService.skipSession(session.user.id);

      if (nextSession && settings.autoStartNext) {
        // Case 1: autoStartNext = true, backend created next session
        setCurrentSessionId(nextSession.id);

        // Map backend session type to our TimerMode
        const nextMode = mapSessionTypeToMode(nextSession.type);

        // Set flag to auto-continue
        setShouldAutoContinue(true);
        setCurrentMode(nextMode);
      } else {
        // Case 2: autoStartNext = false, manually switch to next mode

        // Increment pomodoro count if skipping a pomodoro session
        let newPomodoroCount = pomodoroCount;
        if (currentMode === "pomodoro") {
          newPomodoroCount = pomodoroCount + 1;
          setPomodoroCount(newPomodoroCount);
        }

        const nextMode = getNextModeManual(
          currentMode,
          newPomodoroCount,
          settings.longBreakInterval
        );

        setCurrentMode(nextMode);
        // Timer stops, user must click START
        setIsRunning(false);
      }
    } catch (error) {
      console.error("Failed to skip session:", error);
      alert("Failed to skip session. Please try again.");
    }
  };

  const getBackgroundColor = () => {
    switch (currentMode) {
      case "pomodoro":
        return "bg-gradient-to-br from-red-400 via-red-500 to-red-600";
      case "shortBreak":
        return "bg-gradient-to-br from-green-400 via-green-500 to-green-600";
      case "longBreak":
        return "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600";
      default:
        return "bg-gradient-to-br from-red-400 via-red-500 to-red-600";
    }
  };

  // Show loading state while fetching settings
  if (settingsLoading) {
    return (
      <SidebarInset>
        <div className="h-screen w-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center">
          <div className="text-white text-2xl">Loading settings...</div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      {/* Header with Breadcrumb - Transparent for Pomodoro */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 bg-transparent absolute top-0 left-0 right-0 z-20">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 text-white hover:bg-white/10" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-white/50" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white/90">
                  Pomodoro Timer
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Full Screen Pomodoro Content */}
      <div
        className={`h-screen w-full transition-colors duration-500 ${getBackgroundColor()}`}
      >
        {/* Main Content */}
        <div className="flex items-center justify-center h-full px-4">
          <div className="w-full max-w-2xl">
            {/* App Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-end gap-2 mb-8 mt-5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <ChartArea className="w-4 h-4 mr-2" />
                  Report
                </Button>
                <SettingsModal
                  settings={settings}
                  onSettingsChange={handleSettingsChange}
                />
              </div>
            </div>

            {/* Timer Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-12 text-center shadow-2xl">
              {/* Mode Tabs */}
              <div className="flex justify-center mb-10">
                <div className="bg-black/10 rounded-lg p-1 flex gap-1">
                  <button
                    onClick={() => handleModeChange("pomodoro")}
                    className={`px-6 py-2 rounded-md transition-colors ${
                      currentMode === "pomodoro"
                        ? "bg-black/20 text-white font-medium"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    Pomodoro
                  </button>
                  <button
                    onClick={() => handleModeChange("shortBreak")}
                    className={`px-6 py-2 rounded-md transition-colors ${
                      currentMode === "shortBreak"
                        ? "bg-black/20 text-white font-medium"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    Short Break
                  </button>
                  <button
                    onClick={() => handleModeChange("longBreak")}
                    className={`px-6 py-2 rounded-md transition-colors ${
                      currentMode === "longBreak"
                        ? "bg-black/20 text-white font-medium"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    Long Break
                  </button>
                </div>
              </div>

              {/* Timer Display */}
              <div className="mb-10">
                <div className="text-[120px] sm:text-[140px] font-bold text-white font-mono tracking-tight leading-none">
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Control Button */}
              <div className="mb-4">
                {!isRunning ? (
                  <Button
                    onClick={handleStart}
                    size="lg"
                    className="bg-white text-gray-800 hover:bg-gray-100 px-16 py-4 text-xl font-bold rounded-lg shadow-lg hover:shadow-xl transition-all uppercase tracking-wider"
                  >
                    START
                  </Button>
                ) : (
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={handlePause}
                      size="lg"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-3"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      PAUSE
                    </Button>
                    <Button
                      onClick={handleReset}
                      size="lg"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-3"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      RESET
                    </Button>
                    <Button
                      onClick={handleSkip}
                      size="lg"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-3"
                    >
                      <SkipForward className="w-5 h-5 mr-2" />
                      SKIP
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Info Text */}
            <div className="text-center mt-6">
              <p className="text-white/80 text-sm">
                {currentMode === "pomodoro"
                  ? "Time to focus! Get your tasks done."
                  : "Time for a break! Relax and recharge."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default PomodoroPage;
