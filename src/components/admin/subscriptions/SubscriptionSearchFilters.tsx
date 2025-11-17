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
  return (
    <div className="space-y-4">
      {/* Row 1: UserId, SubscriptionPlanId, Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            UserId
          </label>
          <Input
            placeholder="UserId"
            value={filters.userId}
            onChange={(e) => onFilterChange("userId", e.target.value)}
            type="text"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            SubscriptionPlanId
          </label>
          <Input
            placeholder="SubscriptionPlanId"
            value={filters.subscriptionPlanId}
            onChange={(e) =>
              onFilterChange("subscriptionPlanId", e.target.value)
            }
            type="text"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Status
          </label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => onFilterChange("status", value === "all" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="1">Active</SelectItem>
              <SelectItem value="2">Pending</SelectItem>
              <SelectItem value="3">Expired</SelectItem>
              <SelectItem value="4">Cancelled</SelectItem>
              <SelectItem value="5">Suspended</SelectItem>
              <SelectItem value="6">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: StartDateFrom, StartDateTo, EndDateFrom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            StartDateFrom
          </label>
          <Input
            placeholder="dd/mm/yyyy"
            value={filters.startDateFrom}
            onChange={(e) =>
              onFilterChange("startDateFrom", e.target.value)
            }
            type="date"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            StartDateTo
          </label>
          <Input
            placeholder="dd/mm/yyyy"
            value={filters.startDateTo}
            onChange={(e) => onFilterChange("startDateTo", e.target.value)}
            type="date"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            EndDateFrom
          </label>
          <Input
            placeholder="dd/mm/yyyy"
            value={filters.endDateFrom}
            onChange={(e) =>
              onFilterChange("endDateFrom", e.target.value)
            }
            type="date"
          />
        </div>
      </div>

      {/* Row 3: EndDateTo, SearchTerm, SortBy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            EndDateTo
          </label>
          <Input
            placeholder="dd/mm/yyyy"
            value={filters.endDateTo}
            onChange={(e) => onFilterChange("endDateTo", e.target.value)}
            type="date"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            SearchTerm
          </label>
          <Input
            placeholder="SearchTerm"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange("searchTerm", e.target.value)}
            type="text"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            SortBy
          </label>
          <Input
            placeholder="SortBy"
            value={filters.sortBy}
            onChange={(e) => onFilterChange("sortBy", e.target.value)}
            type="text"
          />
        </div>
      </div>

      {/* Row 4: SortDescending */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            SortDescending
          </label>
          <Select
            value={filters.sortDescending ? "desc" : "asc"}
            onValueChange={(value) =>
              onFilterChange("sortDescending", value === "desc")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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

