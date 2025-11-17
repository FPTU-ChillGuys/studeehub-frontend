"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import {
  SubscriptionSearchFilters,
  SubscriptionsTableWithExpand,
  PaginationControls,
  CreateSubscriptionModal,
} from "@/components/admin/subscriptions";
import {
  SubscriptionsResponse,
  SubscriptionFilters,
  PaymentTransaction,
} from "@/Types/subscriptions";
import { SubscriptionPlan } from "@/Types/subcription-plans";
import { UserProfile } from "@/Types";
import subscriptionService from "@/service/subscriptionService";
import userService from "@/service/userService";
import useStateRef from "react-usestateref";
import subscriptionPlanService from "@/service/subscriptionPlanService";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions, subscriptionsRef] =
    useStateRef<SubscriptionsResponse>();
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plansLoading, setPlansLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  // Search filters
  const [filters, setFilters, filtersRef] = useStateRef<SubscriptionFilters>({
    userId: "",
    subscriptionPlanId: "",
    startDateFrom: "",
    startDateTo: "",
    endDateFrom: "",
    endDateTo: "",
    searchTerm: "",
    pageNumber: 1,
    pageSize: 10,
    sortBy: "StartDate",
    sortDescending: true,
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
      status: 1,
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

  // Handle create subscription
  const handleCreateSubscription = async (data: {
    userId: string;
    subscriptionPlanId: string;
    status: number;
  }) => {
    try {
      // Call the API to create subscription
      // This will be handled by the service call you'll implement
      const response = await subscriptionService.createSubscription(data);
      // Reload subscriptions list
      if (response) {
        await handleSearch();
      } 
    } catch (error) {
      throw error;
    }
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

    // Load subscription plans
    const loadPlans = async () => {
      setPlansLoading(true);
      try {
        // Assuming you have a getAllPlans method in subscriptionService for plans
        // If not, you'll need to create one or use a different service
        const plans = await subscriptionPlanService.getSubscriptionPlans();
        if (plans) {
          setSubscriptionPlans(plans);
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      } finally {
        setPlansLoading(false);
      }
    };

    // Load users
    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        const response = await userService.getUsers({ pageSize: 1000 });
        if (response.data) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setUsersLoading(false);
      }
    };

    loadData();
    loadPlans();
    loadUsers();
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground mt-2">
            Manage user subscriptions and view subscription details
          </p>
        </div>
        <CreateSubscriptionModal
          subscriptionPlans={subscriptionPlans}
          users={users}
          onSubmit={handleCreateSubscription}
          loading={loading || plansLoading}
          usersLoading={usersLoading}
        />
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
          <SubscriptionsTableWithExpand
            subscriptions={subscriptionsRef.current?.data ?? []}
            onRowExpand={async (subscriptionId: string) => {
              try {
                // Call your API to get payment transactions
                const response = await subscriptionService.getTransactionBySubscriptionId(subscriptionId);
                console.log('Fetched transactions:', response);
                return response;
              } catch (error) {
                console.error("Error fetching transactions:", error);
                return [];
              }
            }}
            onStatusUpdate={async (subscriptionId: string, status: number) => {
              try {
                await subscriptionService.updateSubscriptionStatus(subscriptionId, status);
                // Reload subscriptions list
                await handleSearch();
              } catch (error) {
                throw error;
              }
            }}
          />
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
