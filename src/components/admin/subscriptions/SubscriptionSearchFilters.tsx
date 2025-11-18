import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubscriptionFilters } from "@/Types/subscriptions";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SubscriptionSearchFiltersProps {
  filters: SubscriptionFilters;
  onFilterChange: (key: string, value: string | boolean | number) => void;
  onSearch: () => void;
  onReset: () => void;
  loading: boolean;
}

export function SubscriptionSearchFilters({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  loading,
}: SubscriptionSearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Validate GUID format
  const isValidGuid = (value: string): boolean => {
    if (!value) return true; // Allow empty
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return guidRegex.test(value);
  };

  const handleUserIdChange = (value: string) => {
    if (isValidGuid(value)) {
      onFilterChange("userId", value);
    }
  };
  return (
    <div className="space-y-4 w-full">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800">Search Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show
            </>
          )}
        </button>
      </div>

      {/* Filters content - conditionally visible */}
      {isExpanded && (
        <>
          {/* Row 1: User ID, Subscription Plan ID, Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                User ID
              </label>
              <Input
                placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
                value={filters.userId}
                onChange={(e) => handleUserIdChange(e.target.value)}
                type="text"
                className="w-full text-xs"
              />
              {filters.userId && !isValidGuid(filters.userId) && (
                <p className="text-xs text-red-500 mt-1">Invalid GUID format</p>
              )}
            </div>

            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Subscription Plan ID
              </label>
              <Input
                placeholder="Subscription Plan ID"
                value={filters.subscriptionPlanId}
                onChange={(e) =>
                  onFilterChange("subscriptionPlanId", e.target.value)
                }
                type="text"
                className="w-full"
              />
            </div>

            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Status
              </label>
              <Select
                value={filters.status?.toString() || "all"}
                onValueChange={(value) => onFilterChange("status", value === "all" ? "" : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="1">Pending</SelectItem>
                  <SelectItem value="2">Trial</SelectItem>
                  <SelectItem value="3">Active</SelectItem>
                  <SelectItem value="4">Expired</SelectItem>
                  <SelectItem value="5">Cancelled</SelectItem>
                  <SelectItem value="6">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Start Date From, Start Date To, End Date From */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Start Date From
              </label>
              <Input
                placeholder="dd/mm/yyyy"
                value={filters.startDateFrom}
                onChange={(e) =>
                  onFilterChange("startDateFrom", e.target.value)
                }
                type="date"
                className="w-full"
              />
            </div>

            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Start Date To
              </label>
              <Input
                placeholder="dd/mm/yyyy"
                value={filters.startDateTo}
                onChange={(e) => onFilterChange("startDateTo", e.target.value)}
                type="date"
                className="w-full"
              />
            </div>

            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                End Date From
              </label>
              <Input
                placeholder="dd/mm/yyyy"
                value={filters.endDateFrom}
                onChange={(e) =>
                  onFilterChange("endDateFrom", e.target.value)
                }
                type="date"
                className="w-full"
              />
            </div>
          </div>

          {/* Row 3: End Date To, Search Term, Sort By */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                End Date To
              </label>
              <Input
                placeholder="dd/mm/yyyy"
                value={filters.endDateTo}
                onChange={(e) => onFilterChange("endDateTo", e.target.value)}
                type="date"
                className="w-full"
              />
            </div>

            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Search Term
              </label>
              <Input
                placeholder="Search Term"
                value={filters.searchTerm}
                onChange={(e) => onFilterChange("searchTerm", e.target.value)}
                type="text"
                className="w-full"
              />
            </div>

            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Sort By
              </label>
              <Input
                placeholder="Sort By"
                value={filters.sortBy}
                onChange={(e) => onFilterChange("sortBy", e.target.value)}
                type="text"
                className="w-full"
              />
            </div>
          </div>

          {/* Row 4: Sort Descending */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Sort Descending
              </label>
              <Select
                value={filters.sortDescending ? "desc" : "asc"}
                onValueChange={(value) =>
                  onFilterChange("sortDescending", value === "desc")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}

      {/* Search and Reset Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={onSearch}
          disabled={loading}
          className="bg-slate-900 hover:bg-slate-800"
        >
          {loading ? "Searching..." : "Search"}
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          disabled={loading}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

