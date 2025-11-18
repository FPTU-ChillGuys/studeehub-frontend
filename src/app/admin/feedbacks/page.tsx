"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import {
  AdminFeedbacksTable,
  AdminFeedbackFilters,
} from "@/components/admin/feedbacks/AdminFeedbacksTable";
import { Feedback } from "@/Types/feedback";
import feedbackService from "@/service/feedbackService";
import useStateRef from "react-usestateref";
import { toast } from "sonner";
import { APIResponse } from "@/lib/api/client";

export default function AdminFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<APIResponse<Feedback>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Search filters with defaults
  const [filters, setFilters, filtersRef] = useStateRef<AdminFeedbackFilters>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: "CreatedAt",
    sortDescending: true,
    category: undefined,
    status: undefined,
    searchTerm: "",
  });

  // Handle filter changes
  const handleFilterChange = (
    key: string,
    value: string | boolean | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      pageNumber: 1, // Reset to first page when filtering
    }));
  };

  // Search/Filter handler
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedbackService.getFeedbacks(filtersRef.current);
      console.log("Fetched feedbacks:", response);
      setFeedbacks(response.data as unknown as APIResponse<Feedback>[]);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch feedbacks";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 10,
      sortBy: "CreatedAt",
      sortDescending: true,
      category: undefined,
      status: undefined,
      searchTerm: "",
    });
    setCurrentPage(1);
    setTotalPages(1);
    setFeedbacks([]);
    setError(null);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      pageNumber: page,
    }));
    setCurrentPage(page);
  };

  // Initial load
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.pageNumber, filters.category, filters.status, filters.sortBy, filters.sortDescending]);

  return (
    <div className="flex flex-col gap-6 w-full mx-5">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Feedback Management</h1>
        <p className="text-gray-600 mt-2">
          View and manage all user feedback
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="text-red-600" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Content Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Feedbacks</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset Filters
            </Button>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Loading..." : "Search"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AdminFeedbacksTable
            feedbacks={feedbacks || []}
            isLoading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
            filters={filtersRef.current}
          />
        </CardContent>
      </Card>
    </div>
  );
}
