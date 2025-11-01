import { z } from "zod";
import { SubscriptionPlan } from "@/Types";

export const subscriptionPlanSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  description: z.string().min(1, "Description is required"),
  currency: z.string(),
  durationInDays: z.number().min(1, "Duration must be at least 1 day"),
  maxDocuments: z.number().optional(),
  maxStorageMB: z.number().optional(),
  hasAIAnalysis: z.boolean(),
});

export type SubscriptionPlanFormData = z.infer<typeof subscriptionPlanSchema>;

export const defaultValues: Omit<SubscriptionPlan, 'id'> = {
  code: '',
  name: '',
  description: '',
  price: 0,
  currency: '',
  durationInDays: 30,
  maxDocuments: 0,
  maxStorageMB: 0,
  hasAIAnalysis: false,
};
