import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { SubscriptionPlan } from "@/Types/subcription-plans";
import { UserProfile } from "@/Types";

interface CreateSubscriptionModalProps {
  onSubmit: (data: {
    userId: string;
    subscriptionPlanId: string;
    status: number;
  }) => Promise<void>;
  subscriptionPlans: SubscriptionPlan[];
  users: UserProfile[];
  loading?: boolean;
  usersLoading?: boolean;
}

const STATUS_OPTIONS = [
  { value: "1", label: "Pending" },
  { value: "2", label: "Trial" },
  { value: "3", label: "Active" },
  { value: "4", label: "Expired" },
  { value: "5", label: "Cancelled" },
  { value: "6", label: "Failed" },
];

export function CreateSubscriptionModal({
  onSubmit,
  subscriptionPlans,
  users,
  loading = false,
  usersLoading = false,
}: CreateSubscriptionModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    subscriptionPlanId: "",
    status: "3", // Default to Active
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.userId) {
      setError("User is required");
      return;
    }

    if (!formData.subscriptionPlanId) {
      setError("Subscription Plan is required");
      return;
    }

    if (!formData.status) {
      setError("Status is required");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        userId: formData.userId,
        subscriptionPlanId: formData.subscriptionPlanId,
        status: parseInt(formData.status),
      });
      // Reset form and close modal on success
      setFormData({
        userId: "",
        subscriptionPlanId: "",
        status: "3",
      });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create subscription");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-slate-900 hover:bg-slate-800 gap-2"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          Create Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Subscription</DialogTitle>
          <DialogDescription>
            Add a new subscription for a user. Fill in all the required fields.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              User *
            </label>
            <Select
              value={formData.userId}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  userId: value,
                }));
                setError(null);
              }}
              disabled={submitting || users.length === 0 || usersLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {usersLoading ? (
                  <SelectItem value="" disabled>
                    Loading users...
                  </SelectItem>
                ) : users.length === 0 ? (
                  <SelectItem value="" disabled>
                    No users available
                  </SelectItem>
                ) : (
                  users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex flex-col">
                        <span>{user.fullName}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Plan */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Subscription Plan *
            </label>
            <Select
              value={formData.subscriptionPlanId}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  subscriptionPlanId: value,
                }));
                setError(null);
              }}
              disabled={submitting || subscriptionPlans.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a subscription plan" />
              </SelectTrigger>
              <SelectContent>
                {subscriptionPlans.length === 0 ? (
                  <SelectItem value="" disabled>
                    No subscription plans available
                  </SelectItem>
                ) : (
                  subscriptionPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      <div className="flex flex-col">
                        <span>{plan.name}</span>
                        <span className="text-xs text-gray-500">
                          ${plan.price.toFixed(2)} / {plan.durationInDays} days
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Status *
            </label>
            <Select
              value={formData.status}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  status: value,
                }));
                setError(null);
              }}
              disabled={submitting}
            >
              <SelectTrigger className="w-full">
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

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 gap-2"
              disabled={submitting || !formData.userId || !formData.subscriptionPlanId}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
