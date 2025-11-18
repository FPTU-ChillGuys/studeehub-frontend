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
import { Star, Upload, X } from "lucide-react";
import { CategoryType, categoryLabels, Feedback } from "@/Types/feedback";
import { toast } from "sonner";

interface FeedbackEditFormProps {
  feedback: Feedback;
  onSubmit: (data: {
    category: number;
    rating: number;
    title: string;
    message: string;
    keepAttachmentIds?: string[];
    files?: File[];
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export function FeedbackEditForm({
  feedback,
  onSubmit,
  isSubmitting = false,
}: FeedbackEditFormProps) {
  const [category, setCategory] = useState<CategoryType>(feedback.category);
  const [rating, setRating] = useState(feedback.rating);
  const [title, setTitle] = useState(feedback.title);
  const [message, setMessage] = useState(feedback.message);
  const [files, setFiles] = useState<File[]>([]);
  const [existingAttachments] = useState(
    feedback.attachments || []
  );
  const [keepAttachmentIds, setKeepAttachmentIds] = useState<string[]>(
    (feedback.attachments || []).map((att) => att.id)
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleKeepAttachment = (attachmentId: string) => {
    setKeepAttachmentIds((prev) => {
      if (prev.includes(attachmentId)) {
        return prev.filter((id) => id !== attachmentId);
      } else {
        return [...prev, attachmentId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in title and message");
      return;
    }

    try {
      await onSubmit({
        category: category as number,
        rating,
        title,
        message,
        keepAttachmentIds:
          keepAttachmentIds.length > 0 ? keepAttachmentIds : undefined,
        files: files.length > 0 ? files : undefined,
      });
    } catch (error) {
      // Error is handled by parent component
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="edit-category">Feedback Category</Label>
        <Select
          value={category.toString()}
          onValueChange={(value) => setCategory(parseInt(value) as CategoryType)}
          disabled={isSubmitting}
        >
          <SelectTrigger id="edit-category">
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
              disabled={isSubmitting}
              className="transition-transform hover:scale-110 disabled:opacity-50"
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
        <Label htmlFor="edit-title">Title</Label>
        <Input
          id="edit-title"
          placeholder="Enter feedback title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="edit-message">Message</Label>
        <Textarea
          id="edit-message"
          placeholder="Describe your feedback in detail..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
          rows={5}
        />
      </div>

      {/* Existing Attachments */}
      {existingAttachments.length > 0 && (
        <div className="space-y-2">
          <Label>Current Attachments</Label>
          <div className="space-y-2">
            {existingAttachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-gray-100 rounded"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`keep-${attachment.id}`}
                    checked={keepAttachmentIds.includes(attachment.id)}
                    onChange={() => toggleKeepAttachment(attachment.id)}
                    disabled={isSubmitting}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor={`keep-${attachment.id}`}
                    className="text-sm truncate cursor-pointer flex-1"
                  >
                    {attachment.fileName}
                  </label>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Uncheck to remove attachments
          </p>
        </div>
      )}

      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="edit-files">Add New Attachments (Optional)</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
          <input
            id="edit-files"
            type="file"
            multiple
            onChange={handleFileChange}
            disabled={isSubmitting}
            className="hidden"
          />
          <label htmlFor="edit-files" className="cursor-pointer flex flex-col items-center gap-2">
            <Upload size={24} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              Click to upload files or drag and drop
            </span>
          </label>
        </div>

        {/* New File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">New Files:</p>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-blue-50 rounded"
              >
                <span className="text-sm truncate text-blue-900">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={isSubmitting}
                  className="p-1 hover:bg-blue-200 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-2 justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
