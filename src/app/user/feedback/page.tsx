"use client";

import { useState } from "react";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { FeedbackHistory } from "@/components/feedback/FeedbackHistory";
import { Button } from "@/components/ui/button";
import { MessageSquare, History } from "lucide-react";

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feedback</h1>
        <p className="text-gray-600">
          Help us improve StudeeHub by sharing your thoughts and suggestions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <Button
          variant={activeTab === "form" ? "default" : "ghost"}
          onClick={() => setActiveTab("form")}
          className="rounded-b-none"
        >
          <MessageSquare size={16} className="mr-2" />
          Send Feedback
        </Button>
        <Button
          variant={activeTab === "history" ? "default" : "ghost"}
          onClick={() => setActiveTab("history")}
          className="rounded-b-none"
        >
          <History size={16} className="mr-2" />
          Feedback History
        </Button>
      </div>

      {/* Content */}
      {activeTab === "form" && <FeedbackForm />}
      {activeTab === "history" && <FeedbackHistory />}
    </div>
  );
}

