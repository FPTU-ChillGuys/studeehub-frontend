import { Card } from "@/components/ui/card";
import { APIResponse } from "@/lib/api/client";
import { Subscription, SubscriptionsResponse } from "@/Types/subscriptions";

interface SubscriptionsPaginationProps {
  data: SubscriptionsResponse;
}

export function SubscriptionsPagination({
  data,
}: SubscriptionsPaginationProps) {
  return (
    <div className="p-4 border-t text-sm text-muted-foreground">
      Showing {data.data?.length} of {data.totalCount} subscriptions (Page{" "}
      {data.page} of {data.totalPages})
    </div>
  );
}
