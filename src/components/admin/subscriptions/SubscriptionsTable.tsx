import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Subscription } from "@/Types/subscriptions";
import { useEffect } from "react";

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
}

// Status mapping
const statusMap: { [key: number]: string } = {
  1: "Active",
  2: "Pending",
  3: "Expired",
  4: "Cancelled",
  5: "Suspended",
  6: "Inactive",
};

const statusColorMap: { [key: number]: string } = {
  1: "bg-green-500",
  2: "bg-yellow-500",
  3: "bg-gray-500",
  4: "bg-red-500",
  5: "bg-orange-500",
  6: "bg-slate-500",
};

// Format date
const formatDate = (dateString: string) => {
  if (!dateString || dateString === "0001-01-01T00:00:00") return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {

  useEffect(() => {
    console.log("SubscriptionsTable mounted");
    console.log(subscriptions);
  }, [subscriptions])

  return (
    <div className="overflow-x-auto">
      <Table>   
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subscription Plan</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell className="font-medium">
                {subscription.user.fullName}
              </TableCell>
              <TableCell>{subscription.user.email}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {subscription.subscriptionPlan.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {subscription.subscriptionPlan.durationInDays} days
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {formatCurrency(subscription.subscriptionPlan.price)}
              </TableCell>
              <TableCell>{formatDate(subscription.startDate)}</TableCell>
              <TableCell>{formatDate(subscription.endDate)}</TableCell>
              <TableCell>
                <Badge
                  className={`${statusColorMap[subscription.status] || "bg-gray-500"} text-white`}
                >
                  {statusMap[subscription.status] || "Unknown"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
