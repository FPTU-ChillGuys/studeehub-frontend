"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import subscriptionPlanService from "@/service/subscriptionPlanService";
import {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import {
  subscriptionPlanSchema,
  defaultValues as defaultFormValues,
  SubscriptionPlanFormData,
} from "@/schemas/subscription-plan";
import { SubscriptionPlan } from "@/Types";

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  const form = useForm<SubscriptionPlanFormData>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues: {
      ...defaultFormValues,
      id: "",
    },
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await subscriptionPlanService.getSubscriptionPlans();
      setPlans(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch subscription plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openDialog = (plan: SubscriptionPlan | null = null) => {
    setEditingPlan(plan);
    if (plan) {
      form.reset({
        ...plan,
      });
    } else {
      form.reset({
        ...defaultFormValues,
        id: "",
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPlan(null);
    form.reset();
  };

  const openDeleteDialog = (planId: string) => {
    setPlanToDelete(planId);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setPlanToDelete(null);
  };

  const onSubmit = async (formData: SubscriptionPlanFormData) => {
    setLoading(true);
    try {
      const planData: SubscriptionPlan = {
        ...formData,
        id: editingPlan?.id || "",
        code: formData.code || `plan_${Date.now()}`,
        maxDocuments: formData.maxDocuments || 0,
        maxStorageMB: formData.maxStorageMB || 0,
      };

      if (editingPlan) {
        const success = await subscriptionPlanService.updateSubscriptionPlan(
          planData
        );
        if (success) {
          toast.success("Subscription plan updated successfully");
        } else {
          throw new Error("Failed to update plan");
        }
      } else {
        const success = await subscriptionPlanService.createSubscriptionPlan(
          planData
        );
        if (success) {
          toast.success("Subscription plan created successfully");
        } else {
          throw new Error("Failed to create plan");
        }
      }

      await fetchPlans();
      closeDialog();
    } catch {
      toast.error("Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!planToDelete) return;

    try {
      const success = await subscriptionPlanService.deleteSubscriptionPlan(
        planToDelete
      );
      if (success) {
        toast.success("Subscription plan deleted successfully");
        await fetchPlans();
      } else {
        throw new Error("Failed to delete plan");
      }
    } catch {
      toast.error("Failed to delete subscription plan");
    } finally {
      closeDeleteDialog();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingPlan
                  ? "Edit Subscription Plan"
                  : "Create New Subscription Plan"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Field>
                <FieldLabel>Code</FieldLabel>
                <Input
                  placeholder="e.g., premium_plan"
                  {...form.register("code", { valueAsNumber: false })}
                />
                <FieldError errors={[form.formState.errors.code]} />
              </Field>

              <Field>
                <FieldLabel>Plan Name</FieldLabel>
                <Input
                  placeholder="e.g., Premium Plan"
                  {...form.register("name", { valueAsNumber: false })}
                />
                <FieldError errors={[form.formState.errors.name]} />
              </Field>

              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  placeholder="Describe the plan features"
                  className="min-h-[100px]"
                  {...form.register("description", { valueAsNumber: false })}
                  {...form.register("description")}
                />
                <FieldError errors={[form.formState.errors.description]} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Price ($)</FieldLabel>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register("price", { valueAsNumber: true })}
                  />
                  <FieldError errors={[form.formState.errors.price]} />
                </Field>

                <Field>
                  <FieldLabel>Max Documents</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    defaultValue="0"
                    {...form.register("maxDocuments", { valueAsNumber: true })}
                  />
                  <FieldError errors={[form.formState.errors.maxDocuments]} />
                </Field>

                <Field>
                  <FieldLabel>Duration (days)</FieldLabel>
                  <Input
                    type="number"
                    min="1"
                    {...form.register("durationInDays", {
                      valueAsNumber: true,
                    })}
                  />
                  <FieldError errors={[form.formState.errors.durationInDays]} />
                </Field>

                <Field>
                  <FieldLabel>Max Storage (MB)</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    defaultValue="0"
                    {...form.register("maxStorageMB", { valueAsNumber: true })}
                  />
                  <FieldError errors={[form.formState.errors.maxStorageMB]} />
                </Field>
              </div>

              <Field className="w-full rounded-lg border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 pr-4 w-[calc(100%-3rem)]">
                    <FieldLabel className="text-base">AI Analysis</FieldLabel>
                    <FieldDescription className="text-sm text-muted-foreground">
                      Enable AI-powered analysis features for this plan
                    </FieldDescription>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    <Switch
                      checked={form.watch("hasAIAnalysis")}
                      onCheckedChange={(checked) =>
                        form.setValue("hasAIAnalysis", checked)
                      }
                    />
                  </div>
                </div>
              </Field>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Plan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration (days)</TableHead>
              <TableHead>AI Analysis</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>
                  ${plan.price.toFixed(2)}/{plan.durationInDays} days
                </TableCell>
                <TableCell>{plan.durationInDays}</TableCell>
                <TableCell>{plan.hasAIAnalysis ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDialog(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(plan.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {plans.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No subscription plans found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              subscription plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
