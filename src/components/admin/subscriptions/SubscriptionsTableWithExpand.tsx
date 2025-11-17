import { useState } from "react";
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
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Subscription } from "@/Types/subscriptions";

interface PaymentTransaction {
  id: string;
  paymentMethod: string;
  amount: number;
  transactionCode: string;
  status: number;
  createdAt: string;
  completedAt: string;
}

interface SubscriptionsTableWithExpandProps {
  subscriptions: Subscription[];
  onRowExpand?: (subscriptionId: string) => Promise<PaymentTransaction[]>;
}

// Subscription Status mapping
const subscriptionStatusMap: { [key: number]: string } = {
  1: "Pending",
  2: "Trial",
  3: "Active",
  4: "Expired",
  5: "Cancelled",
  6: "Failed",
};

const subscriptionStatusColorMap: { [key: number]: string } = {
  1: "bg-yellow-500",
  2: "bg-blue-500",
  3: "bg-green-500",
  4: "bg-gray-500",
  5: "bg-red-500",
  6: "bg-red-600",
};

// Transaction Status mapping
const transactionStatusMap: { [key: number]: string } = {
  0: "Active",
  1: "Committed",
  2: "Aborted",
  3: "InDoubt",
};

const transactionStatusColorMap: { [key: number]: string } = {
  0: "bg-blue-500",
  1: "bg-green-500",
  2: "bg-red-500",
  3: "bg-orange-500",
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

export function SubscriptionsTableWithExpand({
  subscriptions,
  onRowExpand,
}: SubscriptionsTableWithExpandProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<{
    [key: string]: PaymentTransaction[];
  }>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleExpand = async (subscriptionId: string) => {
    if (expandedId === subscriptionId) {
      setExpandedId(null);
      return;
    }

    // Load transactions if not already loaded
    if (!transactions[subscriptionId] && onRowExpand) {
      setLoadingId(subscriptionId);
      try {
        const data = await onRowExpand(subscriptionId);
        setTransactions((prev) => ({
          ...prev,
          [subscriptionId]: data,
        }));
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setLoadingId(null);
      }
    }

    setExpandedId(subscriptionId);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
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
          {subscriptions.flatMap((subscription) => [
            <TableRow key={subscription.id}>
              <TableCell className="w-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleExpand(subscription.id)}
                  disabled={loadingId === subscription.id}
                  className="h-8 w-8 p-0"
                >
                  {loadingId === subscription.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : expandedId === subscription.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </TableCell>
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
                  className={`${
                    subscriptionStatusColorMap[subscription.status] ||
                    "bg-gray-500"
                  } text-white`}
                >
                  {subscriptionStatusMap[subscription.status] || "Unknown"}
                </Badge>
              </TableCell>
            </TableRow>,
            ...(expandedId === subscription.id
              ? [
                  <TableRow key={`${subscription.id}-expanded`}>
                    <TableCell colSpan={8} className="bg-gray-50 p-0">
                      <div className="p-4">
                        <h4 className="font-semibold mb-4">
                          Payment Transactions
                        </h4>
                        {transactions[subscription.id] &&
                        transactions[subscription.id].length > 0 ? (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Payment Method</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Transaction Code</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Created At</TableHead>
                                  <TableHead>Completed At</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {transactions[subscription.id].map(
                                  (transaction) => (
                                    <TableRow key={transaction.id}>
                                      <TableCell>
                                        {transaction.paymentMethod}
                                      </TableCell>
                                      <TableCell>
                                        {formatCurrency(transaction.amount)}
                                      </TableCell>
                                      <TableCell className="text-xs font-mono">
                                        {transaction.transactionCode}
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          className={`${
                                            transactionStatusColorMap[
                                              transaction.status
                                            ] || "bg-gray-500"
                                          } text-white`}
                                        >
                                          {transactionStatusMap[
                                            transaction.status
                                          ] || "Unknown"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        {formatDate(transaction.createdAt)}
                                      </TableCell>
                                      <TableCell>
                                        {formatDate(transaction.completedAt)}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No transactions found
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>,
                ]
              : []),
          ])}
        </TableBody>
      </Table>
    </div>
  );
}
