"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Upload, X } from "lucide-react";
import { CategoryType, categoryLabels } from "@/Types/feedback";
import feedbackService from "@/service/feedbackService";
import { toast } from "sonner";

export function FeedbackForm() {
  const [category, setCategory] = useState<CategoryType>(CategoryType.SuggestionGeneral);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in title and message");
      return;
    }

    setIsLoading(true);
    try {
      await feedbackService.submitFeedback({
        category,
        rating,
        title,
        message,
        files: files.length > 0 ? files : undefined,
      });

      toast.success("Thank you for your feedback!");
      // Reset form
      setCategory(CategoryType.SuggestionGeneral);
      setRating(5);
      setTitle("");
      setMessage("");
      setFiles([]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit feedback"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Send Us Your Feedback</CardTitle>
        <CardDescription>
          Help us improve StudeeHub by sharing your thoughts and suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Feedback Category</Label>
            <Select
              value={category.toString()}
              onValueChange={(value) => setCategory(parseInt(value) as CategoryType)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Your Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter feedback title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Describe your feedback in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              rows={5}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="files">Attachments (Optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                id="files"
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={isLoading}
                className="hidden"
              />
              <label htmlFor="files" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={24} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to upload files or drag and drop
                </span>
              </label>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-100 rounded"
                  >
                    <span className="text-sm truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={isLoading}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
