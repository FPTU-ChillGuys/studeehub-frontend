"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import pomodoroService, {
  PomodoroSettings,
  UpdatePomodoroSettingsRequest,
} from "@/service/pomodoroService";

export const usePomodoroSettings = () => {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<PomodoroSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings when user is logged in
  useEffect(() => {
    const fetchSettings = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userSettings = await pomodoroService.getSettings(session.user.id);
        setSettings(userSettings);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch Pomodoro settings:", err);
        setError("Failed to load settings");
        // Set default settings on error
        setSettings({
          userId: session.user.id,
          workDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          longBreakInterval: 4,
          autoStartNext: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [session?.user?.id]);

  // Update settings
  const updateSettings = async (newSettings: UpdatePomodoroSettingsRequest) => {
    if (!session?.user?.id) {
      throw new Error("User not logged in");
    }

    try {
      await pomodoroService.updateSettings(session.user.id, newSettings);

      // Refetch settings after successful update to get the latest data
      const refreshedSettings = await pomodoroService.getSettings(
        session.user.id
      );
      setSettings(refreshedSettings);
      return refreshedSettings;
    } catch (err) {
      console.error("Failed to update Pomodoro settings:", err);
      throw err;
    }
  };

  return {
    settings,
    isLoading,
    error,
    updateSettings,
  };
};
