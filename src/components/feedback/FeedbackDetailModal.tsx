"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Download, Send, Edit2 } from "lucide-react";
import {
  Feedback,
  categoryLabels,
  feedbackStatusLabels,
  feedbackStatusColors,
} from "@/Types/feedback";
import feedbackService from "@/service/feedbackService";
import { toast } from "sonner";

interface FeedbackDetailModalProps {
  feedbackId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onFeedbackUpdated?: () => void;
}

export function FeedbackDetailModal({
  feedbackId,
  isOpen,
  onClose,
  onFeedbackUpdated,
}: FeedbackDetailModalProps) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("1");
  const [isEditingResponse, setIsEditingResponse] = useState(false);

  useEffect(() => {
    if (isOpen && feedbackId) {
      loadFeedbackDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, feedbackId]);

  const loadFeedbackDetail = async () => {
    if (!feedbackId) return;

    setIsLoading(true);
    try {
      const data = await feedbackService.getFeedbackDetail(feedbackId);
      console.log("Loaded feedback detail:", data);
      setFeedback(data);
      setResponseText(data.response || "");
      setSelectedStatus(data.status.toString());
      setIsEditingResponse(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load feedback details"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (!feedback || !responseText.trim()) {
      toast.error("Please enter a response");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditingResponse && feedback.response) {
        // Update existing response
        await feedbackService.updateFeedbackResponse(
          feedback.id,
          feedback.id, // responseId is feedbackId for this API
          responseText,
          parseInt(selectedStatus)
        );
        toast.success("Response updated successfully");
      } else {
        // Create new response
        await feedbackService.respondToFeedback(
          feedback.id,
          responseText,
          parseInt(selectedStatus)
        );
        toast.success("Response submitted successfully");
      }
      
      // Reload feedback and trigger parent refresh
      await loadFeedbackDetail();
      onFeedbackUpdated?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit response"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Feedback Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : feedback ? (
          <div className="space-y-6">
            {/* User Info and Status Badge */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {feedback.user?.fullName || "Unknown User"}
                </h4>
                <p className="text-sm text-gray-600">
                  {feedback.user?.userEmail}
                </p>
              </div>
              <Badge
                className={
                  feedbackStatusColors[
                    feedback.status as keyof typeof feedbackStatusColors
                  ]
                }
              >
                {
                  feedbackStatusLabels[
                    feedback.status as keyof typeof feedbackStatusLabels
                  ]
                }
              </Badge>
            </div>

            {/* Category and Rating */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full border">
                {
                  categoryLabels[
                    feedback.category as keyof typeof categoryLabels
                  ]
                }
              </span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < feedback.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <h5 className="font-semibold text-gray-900">{feedback.title}</h5>
            </div>

            {/* Feedback and Response Side by Side (if response exists and not editing) */}
            {feedback.response && !isEditingResponse && (
              <div className="grid grid-cols-2 gap-6">
                {/* Feedback Column */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Feedback</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-gray-800 whitespace-pre-wrap text-sm">
                      {feedback.message}
                    </p>
                    <p className="text-xs text-gray-600 mt-3">
                      {formatDate(feedback.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Response Column */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">Response</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditingResponse(true);
                        setResponseText(feedback.response || "");
                      }}
                    >
                      <Edit2 size={14} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-gray-800 whitespace-pre-wrap text-sm">
                      {feedback.response}
                    </p>
                    <p className="text-xs text-gray-600 mt-3">
                      {formatDate(feedback.respondedAt || "")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback only (if no response yet and not editing) */}
            {!feedback.response && !isEditingResponse && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Feedback</h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-800 whitespace-pre-wrap text-sm">
                    {feedback.message}
                  </p>
                  <p className="text-xs text-gray-600 mt-3">
                    {formatDate(feedback.createdAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Attachments */}
            {feedback.attachments && feedback.attachments.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Attachments</h4>
                <div className="space-y-2">
                  {feedback.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                    >
                      <span className="text-sm truncate">{attachment.fileName}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDownload(attachment.fileUrl, attachment.fileName)
                        }
                      >
                        <Download size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EDIT MODE: Show Feedback + Response Input */}
            {isEditingResponse && (
              <div className="space-y-6 pt-4 border-t">
                {/* Feedback Display */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Feedback</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-gray-800 whitespace-pre-wrap text-sm">
                      {feedback.message}
                    </p>
                    <p className="text-xs text-gray-600 mt-3">
                      {formatDate(feedback.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Response Edit Form */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Response</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                    {/* Response Textarea */}
                    <div>
                      <label className="text-sm font-medium">Response</label>
                      <Textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Type your response here..."
                        rows={5}
                        className="mt-1"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Status Selector */}
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Pending</SelectItem>
                          <SelectItem value="2">In Progress</SelectItem>
                          <SelectItem value="3">Resolved</SelectItem>
                          <SelectItem value="4">Closed</SelectItem>
                          <SelectItem value="5">Acknowledged</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingResponse(false);
                          setResponseText(feedback.response || "");
                          setSelectedStatus(feedback.status.toString());
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitResponse} disabled={isSubmitting}>
                        <Send size={16} className="mr-2" />
                        {isSubmitting ? "Updating..." : "Update Response"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* REPLY MODE: Only show when response is empty AND respondedAt is null */}
            {!feedback.response && !isEditingResponse && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Reply to Feedback</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                  {/* Response Textarea */}
                  <div>
                    <label className="text-sm font-medium">Response</label>
                    <Textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Type your response here..."
                      rows={5}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Status Selector */}
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Pending</SelectItem>
                        <SelectItem value="2">In Progress</SelectItem>
                        <SelectItem value="3">Resolved</SelectItem>
                        <SelectItem value="4">Closed</SelectItem>
                        <SelectItem value="5">Acknowledged</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 justify-end">
                    <Button onClick={handleSubmitResponse} disabled={isSubmitting}>
                      <Send size={16} className="mr-2" />
                      {isSubmitting ? "Submitting..." : "Submit Response"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No feedback found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
