"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import {
  SubscriptionSearchFilters,
  SubscriptionsTable,
  PaginationControls,
} from "@/components/admin/subscriptions";
import {
  SubscriptionsResponse,
  SubscriptionFilters,
} from "@/Types/subscriptions";
import subscriptionService from "@/service/subscriptionService";
import useStateRef from "react-usestateref";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions, subscriptionsRef] =
    useStateRef<SubscriptionsResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search filters
  const [filters, setFilters, filtersRef] = useStateRef<SubscriptionFilters>({
    userId: "",
    subscriptionPlanId: "",
    status: "",
    startDateFrom: "",
    startDateTo: "",
    endDateFrom: "",
    endDateTo: "",
    searchTerm: "",
    pageNumber: 1,
    pageSize: 10,
    sortBy: "",
    sortDescending: false,
  });

  // Handle filter changes
  const handleFilterChange = (
    key: string,
    value: string | boolean | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Search/Filter handler
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await subscriptionService.getSubscriptions(filtersRef.current);
      setSubscriptions(response as unknown as SubscriptionsResponse);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch subscriptions";
      setError(errorMessage);
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      userId: "",
      subscriptionPlanId: "",
      status: "",
      startDateFrom: "",
      startDateTo: "",
      endDateFrom: "",
      endDateTo: "",
      searchTerm: "",
      pageNumber: 1,
      pageSize: 10,
      sortBy: "",
      sortDescending: false,
    });
    setSubscriptions(undefined);
    setError(null);
  };

  // Auto-load subscriptions on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await subscriptionService.getSubscriptions(filtersRef.current);
        setSubscriptions(response as unknown as SubscriptionsResponse);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch subscriptions";
        setError(errorMessage);
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 p-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground mt-2">
          Manage user subscriptions and view subscription details
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Search Filters */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
        <SubscriptionSearchFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />
      </Card>

      {/* Subscriptions Table */}
      {subscriptions && (
        <Card>
          <SubscriptionsTable subscriptions={subscriptionsRef.current?.data ?? []} />
          <PaginationControls
            pageNumber={filters.pageNumber}
            pageSize={filters.pageSize}
            totalCount={subscriptions.totalCount}
            onPageNumberChange={(value: number) =>
              handleFilterChange("pageNumber", value)
            }
            onPageSizeChange={(value: number) =>
              handleFilterChange("pageSize", value)
            }
            onSearch={handleSearch}
            loading={loading}
          />
        </Card>
      )}

      {/* No Data Message */}
      {!subscriptions && !loading && !error && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Click &quot;Search&quot; to load subscriptions
          </p>
        </Card>
      )}
    </div>
  );
}
