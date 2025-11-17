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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* UserId */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            UserId
          </label>
          <Input
            placeholder="UserId"
            value={filters.userId}
            onChange={(e) => onFilterChange("userId", e.target.value)}
            type="text"
          />
        </div>

        {/* SubscriptionPlanId */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
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

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Status
          </label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => onFilterChange("status", value === "all" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
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

        {/* StartDateFrom */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            StartDateFrom
          </label>
          <Input
            placeholder="StartDateFrom"
            value={filters.startDateFrom}
            onChange={(e) =>
              onFilterChange("startDateFrom", e.target.value)
            }
            type="date"
          />
        </div>

        {/* StartDateTo */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            StartDateTo
          </label>
          <Input
            placeholder="StartDateTo"
            value={filters.startDateTo}
            onChange={(e) => onFilterChange("startDateTo", e.target.value)}
            type="date"
          />
        </div>

        {/* EndDateFrom */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            EndDateFrom
          </label>
          <Input
            placeholder="EndDateFrom"
            value={filters.endDateFrom}
            onChange={(e) =>
              onFilterChange("endDateFrom", e.target.value)
            }
            type="date"
          />
        </div>

        {/* EndDateTo */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            EndDateTo
          </label>
          <Input
            placeholder="EndDateTo"
            value={filters.endDateTo}
            onChange={(e) => onFilterChange("endDateTo", e.target.value)}
            type="date"
          />
        </div>

        {/* SearchTerm */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            SearchTerm
          </label>
          <Input
            placeholder="SearchTerm"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange("searchTerm", e.target.value)}
            type="text"
          />
        </div>

        {/* PageNumber */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            PageNumber
          </label>
          <Input
            placeholder="PageNumber"
            value={filters.pageNumber}
            onChange={(e) =>
              onFilterChange("pageNumber", parseInt(e.target.value) || 1)
            }
            type="number"
            min="1"
          />
        </div>

        {/* PageSize */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            PageSize
          </label>
          <Input
            placeholder="PageSize"
            value={filters.pageSize}
            onChange={(e) =>
              onFilterChange("pageSize", parseInt(e.target.value) || 10)
            }
            type="number"
            min="1"
            max="100"
          />
        </div>

        {/* SortBy */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            SortBy
          </label>
          <Input
            placeholder="SortBy"
            value={filters.sortBy}
            onChange={(e) => onFilterChange("sortBy", e.target.value)}
            type="text"
          />
        </div>

        {/* SortDescending */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
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
      <div className="flex gap-3">
        <Button onClick={onSearch} disabled={loading}>
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
