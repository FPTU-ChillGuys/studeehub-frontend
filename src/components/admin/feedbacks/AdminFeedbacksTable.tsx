"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Feedback,
  categoryLabels,
  feedbackStatusLabels,
  feedbackStatusColors,
} from "@/Types/feedback";
import { APIResponse } from "@/lib/api/client";

export interface AdminFeedbackFilters {
  pageNumber?: number;
  pageSize?: number;
  rating?: number;
  category?: number;
  status?: number;
  userId?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
}

interface AdminFeedbacksTableProps {
  feedbacks: APIResponse<Feedback>[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFilterChange: (key: string, value: string | number | boolean | undefined) => void;
  filters: AdminFeedbackFilters;
  onViewDetail: (feedbackId: string) => void;
  totalCount?: number;
}

export function AdminFeedbacksTable({
  feedbacks,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onFilterChange,
  filters,
  onViewDetail,
  totalCount = 0,
}: AdminFeedbacksTableProps) {
  const handlePreviousPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const formatDate = (dateString: string) => {
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
      console.error("Error formatting date:", dateString, error);
      return "Invalid Date";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Search by title or message..."
          value={filters.searchTerm || ""}
          onChange={(e) => onFilterChange("searchTerm", e.target.value)}
          className="flex-1 min-w-48"
        />
        <Select
          value={(filters.category || "all").toString()}
          onValueChange={(value) =>
            onFilterChange("category", value === "all" ? undefined : parseInt(value))
          }
        >
          <SelectTrigger className="min-w-48">
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
        <Select
          value={(filters.status || "all").toString()}
          onValueChange={(value) =>
            onFilterChange("status", value === "all" ? undefined : parseInt(value))
          }
        >
          <SelectTrigger className="min-w-48">
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

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">Loading feedbacks...</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">No feedbacks found</p>
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
                <TableHead className="w-20">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((feedback, index) => (
                <TableRow key={`${index}`} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{feedback.data?.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {
                        categoryLabels[
                          feedback.data?.category as keyof typeof categoryLabels
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
                            i < feedback.data?.rating
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
                          feedback.data?.status as keyof typeof feedbackStatusColors
                        ]
                      }
                    >
                      {
                        feedbackStatusLabels[
                          feedback.data?.status as keyof typeof feedbackStatusLabels
                        ]
                      }
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(feedback.data?.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(feedback.data?.id || "")}
                    >
                      View
                    </Button>
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
            Page {currentPage} of {totalPages} • Total: {totalCount} items
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
    </div>
  );
}
