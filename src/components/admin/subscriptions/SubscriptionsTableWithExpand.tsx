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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Loader2, MoreVertical } from "lucide-react";
import { Subscription } from "@/Types/subscriptions";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onStatusUpdate?: (subscriptionId: string, status: number) => Promise<void>;
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
  onStatusUpdate,
}: SubscriptionsTableWithExpandProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<{
    [key: string]: PaymentTransaction[];
  }>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const STATUS_OPTIONS = [
    { value: "1", label: "Pending" },
    { value: "2", label: "Trial" },
    { value: "3", label: "Active" },
    { value: "4", label: "Expired" },
    { value: "5", label: "Cancelled" },
    { value: "6", label: "Failed" },
  ];

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

  const handleQuickActivate = async (subscription: Subscription) => {
    setUpdatingStatus(true);
    try {
      await onStatusUpdate?.(subscription.id, 3); // 3 = Active
      toast.success("Subscription updated to Active");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleOpenStatusDialog = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setSelectedStatus(subscription.status.toString());
    setStatusDialogOpen(true);
  };

  const handleStatusDialogSubmit = async () => {
    if (!selectedSubscription || !selectedStatus) return;

    setUpdatingStatus(true);
    try {
      await onStatusUpdate?.(selectedSubscription.id, parseInt(selectedStatus));
      toast.success(
        `Subscription updated to ${subscriptionStatusMap[parseInt(selectedStatus)]}`
      );
      setStatusDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <>
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
            <TableHead className="w-40">Actions</TableHead>
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
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={updatingStatus}
                      className="h-8 w-8 p-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleQuickActivate(subscription)}
                      disabled={subscription.status === 3}
                    >
                      Set Active
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleOpenStatusDialog(subscription)}
                    >
                      Change Status
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>,
            ...(expandedId === subscription.id
              ? [
                  <TableRow key={`${subscription.id}-expanded`}>
                    <TableCell colSpan={9} className="bg-gray-50 p-0">
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

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Subscription Status</DialogTitle>
            <DialogDescription>
              Change the status for this subscription. Select a new status and confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                New Status
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setStatusDialogOpen(false)}
                disabled={updatingStatus}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStatusDialogSubmit}
                disabled={updatingStatus || !selectedStatus}
                className="bg-slate-900 hover:bg-slate-800 gap-2"
              >
                {updatingStatus ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

