"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, ChevronLeft, ChevronRight, Eye, Trash2, Edit2 } from "lucide-react";
import {
  Feedback,
  categoryLabels,
  feedbackStatusLabels,
  feedbackStatusColors,
} from "@/Types/feedback";
import feedbackService from "@/service/feedbackService";
import { toast } from "sonner";
import { FeedbackDetailModal } from "./FeedbackDetailModal";
import { FeedbackEditForm } from "./FeedbackEditForm";

interface ApiResponse<T> {
  data?: T;
  message?: string;
  [key: string]: unknown;
}

export function FeedbackHistory() {
  const [feedbacks, setFeedbacks] = useState<ApiResponse<Feedback>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFeedbackData, setEditingFeedbackData] = useState<Feedback | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const pageSize = 10;

  const loadFeedbacks = async (page: number, category: string, status: string) => {
    setIsLoading(true);
    try {
      const response = await feedbackService.getUserFeedbacks({
        pageNumber: page,
        pageSize: pageSize,
        category: category === "all" ? undefined : parseInt(category),
        status: status === "all" ? undefined : parseInt(status),
      });
      console.log("Fetched feedbacks:", response.data);
      setFeedbacks(response.data as unknown as ApiResponse<Feedback>[]);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Failed to load feedback history");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks(currentPage, filterCategory, filterStatus);
  }, [currentPage, filterCategory, filterStatus]);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleViewDetail = (feedbackId: string) => {
    setSelectedFeedbackId(feedbackId);
    setIsReadOnly(true);
    setIsDetailModalOpen(true);
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    setDeleteConfirmId(feedbackId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    setIsDeleting(true);
    try {
      await feedbackService.deleteFeedback(deleteConfirmId);
      toast.success("Feedback deleted successfully");
      setDeleteConfirmId(null);
      loadFeedbacks(currentPage, filterCategory, filterStatus);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete feedback"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditFeedback = (feedback: Feedback) => {
    setEditingFeedbackId(feedback.id);
    setEditingFeedbackData(feedback);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (editedData: {
    category: number;
    rating: number;
    title: string;
    message: string;
    keepAttachmentIds?: string[];
    files?: File[];
  }) => {
    if (!editingFeedbackId) return;

    setIsEditSubmitting(true);
    try {
      await feedbackService.editFeedback(editingFeedbackId, editedData);
      toast.success("Feedback updated successfully");
      setIsEditModalOpen(false);
      setEditingFeedbackData(null);
      setEditingFeedbackId(null);
      loadFeedbacks(currentPage, filterCategory, filterStatus);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update feedback"
      );
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Handle ISO 8601 format with Z or timezone
      const date = new Date(dateString);
      
      // Check if date is valid
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
      console.error("Error formatting date:", dateString, error);
      return "Invalid Date";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Feedback History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-48">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-48">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="1">Pending</SelectItem>
                <SelectItem value="2">In Progress</SelectItem>
                <SelectItem value="3">Resolved</SelectItem>
                <SelectItem value="4">Closed</SelectItem>
                <SelectItem value="5">Acknowledged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Loading feedback...</p>
            </div>
          ) : feedbacks?.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">No feedback found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks?.map((feedback, index) => (
                  <TableRow key={`${index}`} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{feedback?.data?.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {
                          categoryLabels[
                            feedback?.data?.category as keyof typeof categoryLabels
                          ]
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < (feedback?.data?.rating ?? 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          feedbackStatusColors[
                            feedback?.data?.status as keyof typeof feedbackStatusColors
                          ]
                        }
                      >
                        {
                          feedbackStatusLabels[
                            feedback?.data?.status as keyof typeof feedbackStatusLabels
                          ]
                        }
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(feedback?.data?.createdAt || "")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetail(feedback?.data?.id || "")}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const detailedFeedback = await feedbackService.getFeedbackDetail(feedback?.data?.id || "");
                            handleEditFeedback(detailedFeedback);
                          }}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteFeedback(feedback?.data?.id || "")}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} • Total: {feedbacks?.length} items
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Feedback Detail Modal - Read Only */}
      <FeedbackDetailModal
        feedbackId={selectedFeedbackId}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedFeedbackId(null);
        }}
        isReadOnly={isReadOnly}
        onFeedbackUpdated={() => {
          loadFeedbacks(currentPage, filterCategory, filterStatus);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Feedback Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Feedback</DialogTitle>
            <DialogDescription>
              Update your feedback details below
            </DialogDescription>
          </DialogHeader>
          {editingFeedbackData && (
            <FeedbackEditForm
              feedback={editingFeedbackData}
              onSubmit={handleEditSubmit}
              isSubmitting={isEditSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
