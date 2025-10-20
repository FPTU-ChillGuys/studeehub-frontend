"use client";

import { useState, useEffect } from "react";
import { Clock, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TimerSettings {
  pomodoro?: number;
  shortBreak?: number;
  longBreak?: number;
  autoStartNext?: boolean;
  autoStartBreaks?: boolean;
  autoStartPomodoros?: boolean;
  longBreakInterval?: number;
}

interface SettingsModalProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
}

export const SettingsModal = ({
  settings,
  onSettingsChange,
}: SettingsModalProps) => {
  const [tempSettings, setTempSettings] = useState({
    autoStartNext: false,
    longBreakInterval: 4,
    ...settings,
  });
  const [isOpen, setIsOpen] = useState(false);

  // Sync tempSettings when settings prop changes (from API)
  useEffect(() => {
    setTempSettings({
      autoStartNext: false,
      longBreakInterval: 4,
      ...settings,
    });
  }, [settings]);

  const handleSave = () => {
    onSettingsChange(tempSettings);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSettings({
      autoStartNext: false,
      longBreakInterval: 4,
      ...settings,
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white/10"
      >
        <Settings className="w-4 h-4 mr-2" />
        Setting
      </Button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleCancel} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl p-0 z-[60]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-700 uppercase tracking-wide">
            Setting
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </Button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Timer Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-500" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Timer (minutes)
              </h3>
            </div>

            {/* Time inputs in a row */}
            <div className="mb-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-bold">
                    Pomodoro
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    value={tempSettings.pomodoro}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        pomodoro: parseInt(e.target.value) || 25,
                      })
                    }
                    className="text-center bg-gray-100 border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-bold">
                    Short Break
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={tempSettings.shortBreak}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        shortBreak: parseInt(e.target.value) || 5,
                      })
                    }
                    className="text-center bg-gray-100 border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-bold">
                    Long Break
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    value={tempSettings.longBreak}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        longBreak: parseInt(e.target.value) || 15,
                      })
                    }
                    className="text-center bg-gray-100 border-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Auto Start Breaks */}
            <div className="flex items-center justify-between py-3 border-t">
              <span className="text-sm font-medium text-gray-700">
                Auto Start Breaks
              </span>
              <button
                onClick={() =>
                  setTempSettings({
                    ...tempSettings,
                    autoStartNext: !tempSettings.autoStartNext,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tempSettings.autoStartNext ? "bg-green-400" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    tempSettings.autoStartNext
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Long Break Interval */}
            <div className="flex items-center justify-between py-3 border-t">
              <span className="text-sm font-medium text-gray-700">
                Long Break interval
              </span>
              <Input
                type="number"
                min="1"
                max="10"
                value={tempSettings.longBreakInterval}
                onChange={(e) =>
                  setTempSettings({
                    ...tempSettings,
                    longBreakInterval: parseInt(e.target.value) || 4,
                  })
                }
                className="w-20 text-center bg-gray-100 border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Footer with OK button */}
        <div className="px-6 py-4 border-t flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-gray-800 hover:bg-gray-900 text-white px-8"
          >
            OK
          </Button>
        </div>
      </div>
    </>
  );
};
